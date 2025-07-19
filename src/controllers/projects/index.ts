import { Request, Response } from "express";
import { TeamService } from "../../services/team";
import { UserService } from "../../services/users";
import { ClientError } from "../../errors/error-classes/client-error";
import { HttpClientError } from "../../libs/http-response-codes";
import { ProjectService } from "../../services/project";
import { DI } from "../../di";


export class ProjectsController {

    static async create(
        req: Request,
        res: Response
    ) {
        const teamId = req.params.teamId;

        const project = req.body;
        
        const userId = (req as any)?.claims?.userId;

        const teamService = DI.resolve(TeamService);
        const team = await teamService.getMembersById(teamId);

        if(!team) {
            throw new ClientError(
                `No team found having Id '${teamId}'`,
                HttpClientError.NotFound
            )
        }

        const userService = DI.resolve(UserService);
        const user = await userService.getUserById(userId);

        if(!user) {
            throw new ClientError(
                `No user found having Id '${userId}'`,
                HttpClientError.NotFound
            );
        }

        const newProject = {
            teamId,
            ownerId: userId,
            name: project.name
        }

        const projectService = DI.resolve(ProjectService);
        const createdProject = await projectService.create(newProject);

        const members = await userService.getUsersByIds(team);

        res.status(201).send({
            status: "success",
            project: {
                name: createdProject.name,
                owner: {
                    name: user?.name,
                    email: user?.email,
                    userId: user?.userId
                },
                team: members,
                projectId: createdProject.projectId
            },
        });
    }

    static async projects(
        req: Request,
        res: Response
    ) {
        const teamId = req.params.teamId;

        const projectService = DI.resolve(ProjectService);
        const projects = await projectService.getProjectsByTeamId(teamId);

        if(!projects) {
            throw new ClientError(
                `Not team found having Id '${teamId}.'`,
                HttpClientError.NotFound
            );
        }

        const teamService = DI.resolve(TeamService);
        const team = await teamService.getMembersById(teamId);

        if(!team) {
            throw new ClientError(
                `No team found having Id '${teamId}'`,
                HttpClientError.NotFound
            );
        }

        const userService = DI.resolve(UserService);

        const members = await userService.getUsersByIds(team);

        const allProjects = await Promise.all(
            projects.map(async (project) => {
                const owner = await userService.getUserById(project.ownerId);
                return {
                    name: project.name,
                    owner: {
                        name: owner?.name,
                        email: owner?.email,
                        userId: owner?.userId
                    },
                    team: members,
                    projectId: project.projectId,
                };
            })
        );

        res.json({
            status: "success",
            projects: allProjects
        });
    }

    static async invite(
        req: Request,
        res: Response
    ) {
        const userIds = req.body.userIds;
        const projectId = req.params.projectId;

        const projectService = DI.resolve(ProjectService);
        await projectService.inviteMembers(projectId, userIds);

        res.json({
            status: "success"
        });
    }

    static async join(
        req: Request,
        res: Response
    ) {
        const projectId = req.params.projectId;
        const userId = (req as any).claims.userId;

        const projectService = DI.resolve(ProjectService);
        await projectService.join(userId, projectId);

        res.json({
            status: "success"
        });
    }
}
