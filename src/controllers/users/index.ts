import { DI } from "../../di";
import { BACKEND } from "../../configs";
import { Request, Response } from "express";
import { AuthService } from "../../services/auth";
import { UserService } from "../../services/users";
import { createExpiry, createIssueAt } from "@d3vtool/utils";
import { JWTService } from "../../services/token/jwt-service";
import { HttpClientError, HttpSuccess } from "../../libs/http-response-codes";
import { ClientError } from "../../errors/error-classes/client-error";
import { RedisService } from "../../services/memdb/redis-service";
import { sha256 } from "../../libs/utils";
import { MemDB } from "../../services/memdb";


export class UserController {

    static async signup(
        req: Request,
        res: Response,
    ) {
        const signupCreds = req.body;
        
        const authService = DI.resolve(AuthService);
        await authService.signup(signupCreds);

        res.status(201).json({
            status: "success"
        });
    }

    static async login(
        req: Request,
        res: Response,
    ) {
        const loginCreds = req.body;

        const authService = DI.resolve(AuthService);

        const userInfo = await authService.login(loginCreds);

        const jwtService = DI.resolve(JWTService);


        const token = await jwtService.createAccessToken(
            userInfo,
            {   
                aud: req.host,
                iss: BACKEND.URL,
                exp: createExpiry("1h"),
                sub: loginCreds.email,
                iat: createIssueAt(new Date(Date.now())),
            },
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
    
        const userService = DI.resolve(UserService);
        const user = await userService.getUserById(userId);

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
        const user = req.body;

        const userId = (req as any).claims.userId;
        
        const userService = DI.resolve(UserService);
        await userService.updateUserById(userId, user);

        res.status(HttpSuccess.OK.statusCode).json({
           status: "success"
        })
    }

    static async logout(
        req: Request,
        res: Response,
    ) {
        const token = (req as any).jwt;

        const ttl = 3600;

        const memDbService = DI.resolve(MemDB);
        await memDbService.set(`logout::${sha256(token)}`, true, ttl);

        res.json({
            status: "success"
        });
    }
};
