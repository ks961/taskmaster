import { DI } from "../../di";
import { ClientError } from "../../errors/error-classes/client-error";
import { ServerError } from "../../errors/error-classes/server-error";
import { HttpClientError, HttpServerError } from "../../libs/http-response-codes";
import { TTeam } from "../../models/team.model";
import { TUser } from "../../models/user.model";
import { TeamRepository } from "../../repositories/mongo/team/team.repositoty";
import { InviteService } from "../invite";
import { UserService } from "../users";



export class TeamService {

    constructor(
        private readonly teamRepo: TeamRepository<TTeam>
    ) {};

    async create(
        team: Omit<TTeam, "teamId">
    ) {
        return await this.teamRepo.create(team);
    }

    async getMembersById(
        teamId: TTeam["teamId"]
    ) {
        return (await this.teamRepo.findById(teamId))?.members;
    }

    async inviteMembers(
        teamId: TTeam["teamId"],
        members: Array<TUser["userId"]>
    ) {
        const inviteService = DI.resolve(InviteService);
        const invitationPromise = members.map(member =>
            inviteService.invite(teamId, member)
        );

        const result = await Promise.allSettled(invitationPromise);

        const failedForMembers: Array<TUser["userId"]> = [];

        for (let i = 0; i < result.length; i++) {
              const res = result[i];
              
            if (res.status === "rejected") {
                const member = members[i];
                failedForMembers.push(member);
            }
        }

        if(failedForMembers.length > 0) {
            throw new ServerError(
                `Something went wrong while sending invites to these users:\n\t${failedForMembers.join("\n")}`,
                HttpServerError.InternalServerError
            );
        }
    }

    async join(
        teamId: TTeam["teamId"],
        userId: TUser["userId"]
    ) {
        const teamMembers = (await this.teamRepo.findById(teamId))?.members;
        if(!teamMembers) {
            throw new ClientError(
                `No team found with the ID '${teamId}'.`,
                HttpClientError.NotFound
            );
        }
        
        if(teamMembers.includes(userId)) {
            throw new ClientError(
                `User is already a member of this team.`,
                HttpClientError.Conflict
            );
        }
        
        const inviteService = DI.resolve(InviteService);
        const invite = await inviteService.fetchInvite(userId);

        if(!invite || !invite.teams.includes(teamId)) {
            throw new ClientError(
                `You don't have invite for this team.`,
                HttpClientError.Forbidden
            );
        }
        
        // remove from invite.teams collections
        const updatedTeams = invite.teams.filter(tId => tId !== teamId);

        if(updatedTeams.length === 0) {
            await inviteService.deleteById(invite.inviteId);
        } else {
            await inviteService.updateById(invite.inviteId, {
                teams: updatedTeams
            });
        }

        teamMembers.push(userId);
        
        return await this.teamRepo.update(teamId, {
            members: teamMembers
        });
    }

    async updateById(
        teamId: TTeam["teamId"],
        data: Partial<TTeam>
    ) {
        return await this.teamRepo.update(teamId, data);
    }

    async getPendingInvites(
        userId: TUser["userId"]
    ) {
        const inviteService = DI.resolve(InviteService);
        const result = await inviteService.fetchInvites(userId);
        if(!result) return [];
        
        const transformed = result.map(resl => ({
            teams: resl.teams,
            userId: resl.userId,
            inviteId: resl.inviteId
        }));

        return transformed;
    }
}