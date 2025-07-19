import { NextFunction, Request, Response } from "express";

export type ExpressMiddleware = (_: Request, _res: Response, _next: NextFunction) => void;

export interface IUpload {
    middleware(): ExpressMiddleware,
    wasSuccess(req: Request, res: Response): Promise<unknown>,
}