import { TUser } from "../../models/user.model";
import { isInDevelopmentMode } from "../../libs/utils";
import { AppError } from "../../errors/error-classes/app-error";
import { ClientError } from "../../errors/error-classes/client-error";
import { ServerError } from "../../errors/error-classes/server-error";
import { ICrudRepo } from "../../repositories/interfaces/ICommonRepo";
import { HttpClientError, HttpServerError } from "../../libs/http-response-codes";
import { IAuthService, TLoggedInUser, TUserLogin, TUserSignup } from "./interfaces";
import { IPasswordService } from "../password";
import { UserRepository } from "../../repositories/mongo/user/user.repository";


export class AuthService implements IAuthService {

    constructor(
        private readonly userRepo: UserRepository<TUser>,
        private readonly passwordService: IPasswordService
    ) {};

    async signup(user: TUserSignup): Promise<void> {
        try {

            const exists = await this.userRepo.findBy({email: user.email});

            if(exists) {
                throw new ClientError(
                    `User having email ${user.email} already exists.`,
                    HttpClientError.Conflict,
                );
            }

            user.password = await this.passwordService.hash(user.password);

            await this.userRepo.create(user);

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

    async login(creds: TUserLogin): Promise<TLoggedInUser> {

        try {

            const user = await this.userRepo.findBy({email: creds.email});

            if(!user) {
                throw new ClientError(
                    `User having email '${creds.email}' not found.`,
                    HttpClientError.NotFound
                );
            }

            const isOkay = await this.passwordService.verify(
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

}