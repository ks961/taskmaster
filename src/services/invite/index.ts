import { TInvite } from "../../models/invite.model";
import { TTeam } from "../../models/team.model";
import { TUser } from "../../models/user.model";
import { InviteRepository } from "../../repositories/mongo/invite/invite.repository";


export class InviteService {
    constructor(
        private readonly inviteRepo: InviteRepository
    ) {};

    async invite(
        teamId: TTeam["teamId"],
        member: TUser["userId"]
    ) {
        return await this.inviteRepo.add(teamId, member);    
    }

    async fetchInvite(
        userId: TUser["userId"]
    ) {
        return await this.inviteRepo.findBy({userId});
    }

    async fetchInvites(
        userId: TUser["userId"]
    ) {
        return await this.inviteRepo.findMany({userId});
    }

    async updateById(
        inviteId: TInvite["inviteId"],
        data: Partial<TInvite>
    ) {
        return await this.inviteRepo.update(inviteId, data);
    }

    async deleteById(
        inviteId: TInvite["inviteId"]
    ) {
        return await this.inviteRepo.delete(inviteId);
    }
}