import { NextFunction, Request, Response } from "express";
import { ClientError } from "../errors/error-classes/client-error";
import { HttpClientError } from "../libs/http-response-codes";
import { JWTService } from "../services/token/jwt-service";
import { DI } from "../di";
import { sha256 } from "../libs/utils";
import { MemDB } from "../services/memdb";


export async function isAuthenticated(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    const authHeader = req.get('Authorization');

    const token = authHeader?.split(" ")[1]?.trim();
    
    if(!token) {
        throw new ClientError(
            "Auth token not found.",
            HttpClientError.Unauthorized
        );
    }

    const memDbService = DI.resolve(MemDB);
    const isLoggedOut = await memDbService.has(`logout::${sha256(token)}`);

    if(isLoggedOut) {
        throw new ClientError(
            "User already been logged out.",
            HttpClientError.Unauthorized
        );
    }

    const service = DI.resolve(JWTService);
    const claims = await service.verifyToken(token);

    (req as any).jwt = token;
    (req as any).claims = claims;

    next();
}
