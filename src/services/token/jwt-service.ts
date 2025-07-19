import { signJwt, verifyJwt  } from "@d3vtool/utils";
import { JwtClaim } from "@d3vtool/utils/dist/types/jwt/jwt";
import { CustomClaims, ITokenService } from "./interfaces";
import { config } from "../../configs";
import { DirtyJwtSignature, ExpiredJwt, InvalidJwt } from "@d3vtool/utils";
import { ServerError } from "../../errors/error-classes/server-error";
import { HttpClientError, HttpServerError } from "../../libs/http-response-codes";
import { isInDevelopmentMode } from "../../libs/utils";

export class JWTService implements ITokenService {

    async createAccessToken(
        customClaims: Record<string, string>,
        claim: JwtClaim
    ): Promise<string> {
        return await signJwt(
            claim,
            customClaims,
            config.JWT_SEC
        );
    }

    async verifyToken<T extends CustomClaims>(token: string): Promise<JwtClaim & T> {

        try {
            return await verifyJwt<JwtClaim & T>(token, config.JWT_SEC);
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
    
}