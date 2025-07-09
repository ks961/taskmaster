import type { Response } from "express";
import { isInDevelopmentMode } from "../../libs/utils";
import type { ClientError } from "../error-classes/client-error";

/**
 * Handles client errors and sends an error response.
 * 
 * @param error - The client error.
 * @param res - The response object.
 */
export function clientError(
    error: ClientError,
    res: Response
) {
        const response = {
            status: "error",
            error: error.name,
            message: error.message,
            stackTrace: isInDevelopmentMode() ?  error.stack : undefined
        }

        res.status(error.statusCode).json(response);
}
