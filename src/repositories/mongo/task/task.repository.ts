import { MongoRepository } from "..";
import { TProject } from "../../../models/project.model";
import { TTask } from "../../../models/task.model";
import { TUser } from "../../../models/user.model";
import { ICrudRepo } from "../../interfaces/ICommonRepo";


export class TaskRepository<T> {

    constructor(
        private readonly dbRepo: ICrudRepo<T>
    ) {};

    async findAll(): Promise<T[]> {
        return await this.dbRepo.findAll();
    }

    async findAllBy(data: Partial<T>): Promise<T[]> {
        return await this.dbRepo.findMany(data);
    }

    async findBy(data: Partial<T>): Promise<T | null> {
        return await this.dbRepo.findBy(data);
    }

    async findById(id: string): Promise<T | null> {
        return await this.dbRepo.findById(id, "taskId");
    }

    async create(user: Partial<T>): Promise<T | never> {
        return await this.dbRepo.create(user);
    }

    async update(id: string, data: Partial<T>): Promise<T | never> {
        const updated = await this.dbRepo.update(id, data, "taskId");

        return updated;
    }
    
    async delete(id: string): Promise<T | never> {
        const deleted = await this.dbRepo.delete(id, "taskId");

        return deleted;
    }

    async searchText(
        text: string,
        filter: Partial<T>
    ) {
        if(!("textSearch" in this.dbRepo)) {
            return [];
        }
        return await (this.dbRepo as MongoRepository<T>).textSearch(text, filter);
    }


    async updateArray<F>(
        data: F | F[],
        field: string,
        taskId: TTask["taskId"],
    ) {
        return await (this.dbRepo as MongoRepository<T>).updateArray({
            taskId
        } as any, field, data, "$push");
    }
}