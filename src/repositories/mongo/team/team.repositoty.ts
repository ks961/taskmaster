// import { Model } from "mongoose";
// import { TTeam } from "../../models/team.model";
// import { ITeamRepo } from "../interfaces/ITeamRepo";
// import { ClientError } from "../../errors/error-classes/client-error";
// import { HttpClientError } from "../../libs/http-response-codes";

import { ITeamRepo } from "./ITeamRepo";
import { ICrudRepo } from "../../interfaces/ICommonRepo";


export class TeamRepository<T> implements ITeamRepo {

    constructor(
        private readonly dbRepo: ICrudRepo<T>
    ) {}

    async findAll(): Promise<T[]> {
        return await this.dbRepo.findAll();
    }

    async findBy(data: Partial<T>): Promise<T | null> {
        return await this.dbRepo.findBy(data);
    }

    async findById(id: string): Promise<T | null> {
        return await this.dbRepo.findById(id, "teamId");
    }

    async create(team: Partial<T>): Promise<T | never> {
       return await this.dbRepo.create(team);
    }

    async update(id: string, data: Partial<T>): Promise<T | never> {
        return await this.dbRepo.update(id, data, "teamId");
    }

    async delete(id: string): Promise<T | never> {
        return await this.dbRepo.delete(id, "teamId");
    }
}