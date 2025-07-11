import { AppError } from "./app-error";
import type { HttpClientError } from "../../libs/http-response-codes";

/**
 * Creates an instance of ServerError.
 * 
 * @param message - The error message describing the server issue.
 * @param statusCode - Http response code.
 */
export class ClientError extends AppError {
    statusCode;
    
    constructor(
        message: string,
        httpError: HttpClientError
    ) {
        super(message);
        this.name = httpError.errorName;
        this.statusCode = httpError.statusCode;
    }
}
