import { createExpiry, createIssueAt, DirtyJwtSignature, ExpiredJwt, InvalidJwt, signJwt, verifyJwt } from "@d3vtool/utils";
import { BACKEND, config } from "../../configs";
import { AppError } from "../../errors/error-classes/app-error";
import { ClientError } from "../../errors/error-classes/client-error";
import { ServerError } from "../../errors/error-classes/server-error";
import { HttpClientError, HttpServerError } from "../../libs/http-response-codes";
import { TUser, User } from "../../models/user.model";
import bcrypt from "bcryptjs";
import { isInDevelopmentMode } from "../../libs/utils";

export class UserService {

    static async create(user: TUser) {
        try {
            const exists = await User.findOne({email: user.email});
            if(exists) {
                throw new ClientError(
                    `User having email ${user.email} already exists.`,
                    HttpClientError.Conflict,
                );
            }

            user.password = await bcrypt.hash(
                user.password,
                config.SALT_ROUNDS
            );

            const newUser = new User(user);
            await newUser.save();

        } catch(err: unknown) {
            if(err instanceof AppError) {
                throw err;
            }

            throw new ServerError(
                "Something went wrong while creating new user.",
                HttpServerError.InternalServerError
            );
        }
    }

    static async authenticate(
        creds: Pick<TUser, "email" | "password">
    ): Promise<Omit<TUser, "password">> {
        try {

            const user = await User.findOne({email: creds.email});
            if(!user) {
                throw new ClientError(
                    `User having email '${creds.email}' not found.`,
                    HttpClientError.NotFound
                );
            }

            const isOkay = await bcrypt.compare(
                creds.password,
                user.password
            );

            if(!isOkay) {
                throw new ClientError(
                    "Invalid login credentials.",
                    HttpClientError.Unauthorized
                )
            }

            return {
                name: user.name,
                email: user.email,
                userId: user.userId
            };

        } catch(err: unknown) {
            if(err instanceof AppError) {
                throw err;
            }

            if(isInDevelopmentMode()) {
                throw err;
            }
            throw new ServerError(
                "Something went wrong while authenticating user.",
                HttpServerError.InternalServerError
            );
        }
    }

    /**
     * Generates a JSON Web Token (JWT) for a specified audience and subject.
     * 
     * @param audience - The intended audience for the JWT, usually a service or system the token is meant for.
     * @param subject - The subject of the JWT, typically the user or entity the token represents.
     * @param customClaims - A set of custom claims to include in the JWT payload. Each claim should be a key-value pair.
     */
    static async generateJwtFor(
        audience: string,
        subject: string,
        customClaims: Record<string, string>
    ) {

        const token = await signJwt(
            {
                aud: audience,
                iss: BACKEND.URL,
                exp: createExpiry("1h"),
                sub: subject,
                iat: createIssueAt(new Date(Date.now())),
            },
            customClaims,
            config.JWT_SEC
        );

        return token;
    }

    /**
     * Verifies the validity of a given JWT (JSON Web Token).
     * 
     * @param token - The JWT to be verified.
     */
    static async verifyJwt<T extends Record<string, string> & Object>(
        token: string
    ) {
        try {
            return await verifyJwt<T>(token, config.JWT_SEC);
        } catch(error) {
            if (error instanceof DirtyJwtSignature) {
                throw new ServerError(
                    "JWT signature is invalid or has been tampered with.",
                    HttpClientError.BadRequest
                );
            } else if (error instanceof ExpiredJwt) {
                throw new ServerError(
                    "JWT has expired.",
                    HttpClientError.Unauthorized
                );
            } else if (error instanceof InvalidJwt) {
                throw new ServerError(
                    "JWT is malformed or cannot be decoded.",
                    HttpClientError.BadRequest
                );
            } else {
                throw new ServerError(
                    `${isInDevelopmentMode() ? error : "Error occured while verifying jwt token."}`,
                    HttpServerError.InternalServerError
                );
            }
        }
    }
};
