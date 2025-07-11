import { NextFunction, Request, Response } from "express";
import { ClientError } from "../errors/error-classes/client-error";
import { HttpClientError } from "../libs/http-response-codes";
import { UserService } from "../services/users";


export async function isAuthenticated(
    req: Request,
    res: Response,
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

    const claims = await UserService.verifyJwt(token);

    (req as any).claims = claims;

    next();
}
