import { Request, Response } from "express";
import { DI } from "../../di";
import { TeamService } from "../../services/team";
import { HttpClientError, HttpSuccess } from "../../libs/http-response-codes";
import { UserService } from "../../services/users";
import { ClientError } from "../../errors/error-classes/client-error";
import { Team } from "../../models/team.model";


export class TeamsController {

    static async create(
        req: Request,
        res: Response
    ) {
        const teamInfo = req.body;

        const userId = (req as any).claims.userId;
        
        const teamService = DI.resolve(TeamService);
        
        const team = await teamService.create({
            ...teamInfo,
            members: [ userId ]
        });

        res.status(HttpSuccess.Created.statusCode).json({
            status: "success",
            team: {
                name: team.name,
                teamId: team.teamId,
                members: team.members
            }
        });
    }
    
    static async members(
        req: Request,
        res: Response
    ) {
        const teamId = req.params.teamId;
        
        const teamService = DI.resolve(TeamService);
        
        const memberIds = await teamService.getMembersById(teamId);
        if(!memberIds) {
            throw new ClientError(
                `No team found with the ID '${teamId}'.`,
                HttpClientError.NotFound
            )
        }
        const userService = DI.resolve(UserService);
        const promises = memberIds.map(id => userService.getUserById(id));
        
        try {
            const members = (await Promise.all(promises)).map(
                res => ({name: res?.name, userId: res?.userId})
            );
        
            res.status(HttpSuccess.OK.statusCode).json({
                status: "success",
                members
            });
        } catch(err: unknown) {
            throw err;
        }
    }

    static async invite(
        req: Request,
        res: Response
    ) {
        const teamId = req.params.teamId;
        const members = req.body.members;

        const teamService = DI.resolve(TeamService)
        await teamService.inviteMembers(teamId, members);

        res.json({
            status: "success"
        });
    }

    static async join(
        req: Request,
        res: Response
    ) {
        const teamId = req.params.teamId;
        const userId = (req as any).claims.userId;

        const teamService = DI.resolve(TeamService);
        await teamService.join(teamId, userId);

        res.json({
            status: "success"
        });
    }

    static async pendingInvitation(
        req: Request,
        res: Response
    ) {
        const userId = (req as any).claims.userId;

        const teamService = DI.resolve(TeamService);
        const result = await teamService.getPendingInvites(userId);

        res.json({
            status: "success",
            pendingInvites: result
        })
    }
}
