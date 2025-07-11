import { Request, Response } from "express";
import { User } from "../../models/user.model";
import { ClientError } from "../../errors/error-classes/client-error";
import { HttpClientError } from "../../libs/http-response-codes";
import { Project } from "../../models/project.model";


export class ProjectsController {

    static async create(
        req: Request,
        res: Response
    ) {
        const teamId = req.params.teamId;
        const creatorUserId = (req as any)?.claims?.userId;

        const user = await User.findOne({userId: creatorUserId});

        if(!user) {
            throw new ClientError(
                "User not found",
                HttpClientError.NotFound
            );
        }

        const project = new Project({
            name: "project-name",
            owner: user,
            members: [user]
        });

        await project.save();

        res.status(201).send({
            status: "success"
        });
    }

    static async projects(
        req: Request,
        res: Response
    ) {
        
    }

    static async invite(
        req: Request,
        res: Response
    ) {
        
    }
}
