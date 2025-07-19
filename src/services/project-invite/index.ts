import { TUser } from "../../models/user.model";
import { TProject } from "../../models/project.model";
import { TProjectInvite } from "../../models/project-invite.model";
import { ProjectInviteRepository } from "../../repositories/mongo/project-invite/project-invite.repository";


export class ProjectInviteService {
    constructor(
        private readonly inviteRepo: ProjectInviteRepository
    ) {};

    async invite(
        userId: TUser["userId"],
        project: TProject["projectId"],
    ) {
        return await this.inviteRepo.add(userId, project);    
    }

    async fetchInvite(
        userId: TUser["userId"]
    ) {
        return await this.inviteRepo.findBy({userId});
    }

    async updateById(
        userId: TUser["userId"],
        data: Partial<TProjectInvite>
    ) {
        return await this.inviteRepo.update(userId, data);
    }

    async deleteById(
        userId: TUser["userId"]
    ) {
        return await this.inviteRepo.delete(userId);
    }
}