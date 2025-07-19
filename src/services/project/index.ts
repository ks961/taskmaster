import { DI } from "../../di";
import { ClientError } from "../../errors/error-classes/client-error";
import { ServerError } from "../../errors/error-classes/server-error";
import { HttpServerError, HttpClientError } from "../../libs/http-response-codes";
import { TProject } from "../../models/project.model";
import { TUser } from "../../models/user.model";
import { ProjectRepository } from "../../repositories/mongo/project/project.repository";
import { ProjectInviteService } from "../project-invite";
import { TeamService } from "../team";


export class ProjectService {

    constructor(
        private readonly projectRepo: ProjectRepository
    ) {};

    async create(
        project: Partial<TProject>
    ) {
        return await this.projectRepo.create(project);
    }

    async getProjectsByTeamId(
        teamId: TProject["teamId"]
    ) {
        return await this.projectRepo.findManyBy({teamId});
    }

    async inviteMembers(
        projectId: TProject["projectId"],
        userIds: Array<TUser["userId"]>
    ) {
        const inviteService = DI.resolve(ProjectInviteService);

        const invitationPromise = userIds.map(userId =>
            inviteService.invite(userId, projectId)
        );

        const result = await Promise.allSettled(invitationPromise);

        const failedForUsers: Array<TProject["projectId"]> = [];

        for (let i = 0; i < result.length; i++) {
              const res = result[i];
              
            if (res.status === "rejected") {
                const projectId = userIds[i];
                failedForUsers.push(projectId);
            }
        }

        if(failedForUsers.length > 0) {
            throw new ServerError(
                `Something went wrong while sending invites for these users:\n\t${failedForUsers.join("\n")}`,
                HttpServerError.InternalServerError
            );
        }
    }

    async join(
        userId: TUser["userId"],
        projectId: TProject["projectId"],
    ) {
        const project = await this.projectRepo.findBy({projectId});

        if(!project) {
            throw new ClientError(
                `Project having Id '${projectId}' not found.`,
                HttpClientError.NotFound
            )
        }
        
        const teamService = DI.resolve(TeamService);
        const teamMembers = await teamService.getMembersById(project.teamId);

        if(!teamMembers) {
            throw new ClientError(
                `No team found with the ID '${project.teamId}'.`,
                HttpClientError.NotFound
            );
        }
        
        if(teamMembers.includes(userId)) {
            throw new ClientError(
                `User is already a member of this team.`,
                HttpClientError.Conflict
            );
        }
        
        const inviteService = DI.resolve(ProjectInviteService);
        const invite = await inviteService.fetchInvite(userId);

        if(!invite || !invite.projects.includes(projectId)) {
            throw new ClientError(
                `You don't have invite for this project.`,
                HttpClientError.Forbidden
            );
        }
        
        // remove from invite.teams collections
        const updatedTeams = invite.projects.filter(pId => pId !== projectId);

        if(updatedTeams.length === 0) {
            await inviteService.deleteById(userId);
        } else {
            await inviteService.updateById(userId, {
                projects: updatedTeams
            });
        }

        teamMembers.push(userId);
        
        return await teamService.updateById(
            project.teamId,
            {
                members: teamMembers
            }
        );
    }
}