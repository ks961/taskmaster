import { TProject } from "../../../models/project.model";
import { ICrudRepo } from "../../interfaces/ICommonRepo";


export class ProjectRepository {
    constructor(
        private readonly dbRepo: ICrudRepo<TProject>
    ) {}
    
    async findAll(): Promise<TProject[]> {
        return await this.dbRepo.findAll();
    }

    async findManyBy(data: Partial<TProject>): Promise<TProject[]> {
        return await this.dbRepo.findMany(data);
    }

    async findBy(data: Partial<TProject>): Promise<TProject | null> {
        return await this.dbRepo.findBy(data);
    }

    async findById(id: string): Promise<TProject | null> {
        return await this.dbRepo.findById(id, "projectId");
    }

    async create(team: Partial<TProject>): Promise<TProject | never> {
       return await this.dbRepo.create(team);
    }

    async update(id: string, data: Partial<TProject>): Promise<TProject | never> {
        return await this.dbRepo.update(id, data, "projectId");
    }

    async delete(id: string): Promise<TProject | never> {
        return await this.dbRepo.delete(id, "projectId");
    }
}