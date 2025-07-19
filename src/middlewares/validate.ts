import { ObjectValidationError, ObjectValidator } from "@d3vtool/utils";
import { NextFunction, Request, Response } from "express";
import { ClientError } from "../errors/error-classes/client-error";
import { HttpClientError, HttpServerError } from "../libs/http-response-codes";
import { ServerError } from "../errors/error-classes/server-error";

type ValidationTarget = "body" | "params" | "query";

export function validate<T extends ObjectValidator<any>>(
    schema: T,
    validationTarget: ValidationTarget
) {
    return (
        req: Request, 
        _res: Response, 
        next: NextFunction
    ) => {
        const data = (req as any)[validationTarget];

        try {
            schema.validate(data);
        } catch(err: unknown) {
            if(err instanceof ObjectValidationError) {
                throw new ClientError(
                    `For key '${err.key}': ${err.message}`,
                    HttpClientError.BadRequest
                );
            }

            throw err;
        }
        next();
    };
}