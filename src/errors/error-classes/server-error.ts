import { AppError } from "./app-error";
import type { HttpServerError } from "../../libs/http-response-codes";

/**
 * Creates an instance of ServerError.
 * 
 * @param message - The error message describing the server issue.
 * @param statusCode - Http response code.
 */
export class ServerError extends AppError {
    statusCode;
    
    constructor(
        message: string,
        httpError: HttpServerError 
    ) {
        super(message);
        this.name = httpError.errorName;
        this.statusCode = httpError.statusCode;
    }
}
