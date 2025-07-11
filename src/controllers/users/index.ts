import { NextFunction, Request, Response } from "express";


export class UserController {


    static async signup(
        req: Request,
        res: Response,
    ) {

    }

    static async login(
        req: Request,
        res: Response,
    ) {

    }

    static async profile(
        req: Request,
        res: Response,
    ) {
        res.send("works");
    }

    static async updateProfile(
        req: Request,
        res: Response,
    ) {

    }

    static async logout(
        req: Request,
        res: Response,
    ) {

    }

};
