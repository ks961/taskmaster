import { ClientError } from "../../../errors/error-classes/client-error";
import { HttpClientError } from "../../../libs/http-response-codes";
import { TProjectInvite } from "../../../models/project-invite.model";
import { TProject } from "../../../models/project.model";
import { TUser } from "../../../models/user.model";
import { ICrudRepo } from "../../interfaces/ICommonRepo";


export class ProjectInviteRepository {
    constructor(
        private readonly dbRepo: ICrudRepo<TProjectInvite>
    ){};

    async add(
        userId: TUser["userId"],
        project: TProject["projectId"],
    ) {
        const invites = await this.dbRepo.findBy({userId});

        if(!invites) {
            return await this.dbRepo.create({
                userId,
                projects: [project]
            });
        }


        if(!invites.projects.includes(project)) {
            throw new ClientError(
                "You are already a member of these projects.",
                HttpClientError.Conflict
            );
        } else {
            const updatedMembers = [...invites.projects, project];
    
            return await this.dbRepo.update(userId, {
                projects: updatedMembers
            }, "userId");
        }
    }

    async findBy(data: Partial<TProjectInvite>): Promise<TProjectInvite | null> {
        return await this.dbRepo.findBy(data);
    }

    async update(
        userId: TProjectInvite["userId"],
        data: Partial<TProjectInvite>
    ) {
        return await this.dbRepo.update(userId, data, "userId");
    }

    async delete(
        userId: TProjectInvite["userId"]
    ) {
        return await this.dbRepo.delete(userId, "userId");
    }
}