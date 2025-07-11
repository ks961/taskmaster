import { NextFunction, Request, Response } from "express";
import { isInDevelopmentMode } from "../../libs/utils";
import { HttpServerError } from "../../libs/http-response-codes";
import { ClientError } from "../error-classes/client-error";
import { clientError } from "./client-error";
import { ServerError } from "../error-classes/server-error";
import { serverError } from "./server-error";


/**
 * @param error - The error object, might be unexpected server-side issue.
 * @param _req - The request object.
 * @param res - The response object to send the error response.
*/
export function defaultErrorHandler(
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    
    if(error instanceof ClientError) {
        return clientError(
            error,
            res
        );
    }

    if(error instanceof ServerError) {
        return serverError(
            error,
            res
        );
    }
    
    res.status(HttpServerError.InternalServerError.statusCode).json({
        status: "error",
        error: "unknown",
        message: "Something went wrong!",
        stackTrace: isInDevelopmentMode() && (error instanceof Error) ?
            error.stack : undefined
    });
}
