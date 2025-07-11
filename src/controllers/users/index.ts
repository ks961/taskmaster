import { Request, Response } from "express";
import { UserService } from "../../services/users";
import { User } from "../../models/user.model";
import { ClientError } from "../../errors/error-classes/client-error";
import { HttpClientError } from "../../libs/http-response-codes";


export class UserController {


    static async signup(
        req: Request,
        res: Response,
    ) {
        const signupCreds = req.body;

        await UserService.create(signupCreds);

        res.status(201).json({
            status: "success"
        });
    }

    static async login(
        req: Request,
        res: Response,
    ) {
        const loginCreds = req.body;

        const userInfo = await UserService.authenticate(loginCreds);

        const token = await UserService.generateJwtFor(
            req.host,
            loginCreds.email,
            userInfo
        );

        res.status(200).json({
            status: "success",
            token
        });
    }

    static async profile(
        req: Request,
        res: Response,
    ) {
        const userId = (req as any).claims.userId;
        
        const user = await User.findOne({userId});

        if(!user) {
            throw new ClientError(
                `User having user Id '${userId}' is not found.`,
                HttpClientError.NotFound
            );
        }

        res.status(200).json({
            status: "success",
            user: {
                name: user.name,
                email: user.email,
                userId: user.userId
            }
        });
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
