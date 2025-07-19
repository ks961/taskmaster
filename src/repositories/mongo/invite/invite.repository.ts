import { TInvite } from "../../../models/invite.model";
import { TTeam } from "../../../models/team.model";
import { TUser } from "../../../models/user.model";
import { ICrudRepo } from "../../interfaces/ICommonRepo";
import { IInviteRepo } from "./IInviteRepo";


export class InviteRepository implements IInviteRepo<TInvite> {
    
    constructor(
        private readonly dbRepo: ICrudRepo<TInvite>
    ){};

    async add(
        teamId: TTeam["teamId"],
        member: TUser["userId"]
    ) {
        const invites = await this.dbRepo.findBy({userId: member});

        if(!invites) {
            return await this.dbRepo.create({
                userId: member,
                teams: [teamId]
            });
        }

        if (!invites.teams.includes(teamId)) {
            const updatedMembers = [...invites.teams, member];

            return await this.dbRepo.update(teamId, {
                teams: updatedMembers
            }, "inviteId");
        }

        return invites;
    }

    async findMany(data: Partial<TInvite>): Promise<TInvite[] | null> {
        return await this.dbRepo.findMany(data);
    }

    async findBy(data: Partial<TInvite>): Promise<TInvite | null> {
        return await this.dbRepo.findBy(data);
    }

    async update(
        inviteId: TInvite["inviteId"],
        data: Partial<TInvite>
    ) {
        return await this.dbRepo.update(inviteId, data, "inviteId");
    }

    async delete(
        inviteId: TInvite["inviteId"]
    ) {
        return await this.dbRepo.delete(inviteId, "inviteId");
    }
}