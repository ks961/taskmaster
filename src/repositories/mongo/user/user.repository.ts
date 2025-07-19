import { ICrudRepo } from "../../interfaces/ICommonRepo";
import { HttpClientError } from "../../../libs/http-response-codes";
import { ClientError } from "../../../errors/error-classes/client-error";
import { IUserRepo } from "./IUserRepo";

export class UserRepository<T> implements IUserRepo {

    constructor(
        private readonly dbRepo: ICrudRepo<T>
    ) {};

    async findAll(): Promise<T[]> {
        return await this.dbRepo.findAll();
    }

    async findBy(data: Partial<T>): Promise<T | null> {
        return await this.dbRepo.findBy(data);
    }

    async findById(id: string): Promise<T | null> {
        return await this.dbRepo.findById(id, "userId");
    }

    async create(user: Partial<T>): Promise<T | never> {
        return await this.dbRepo.create(user);
    }

    async update(id: string, data: Partial<T>): Promise<T | never> {
        const updated = await this.dbRepo.update(id, data, "userId");

        return updated;
    }
    
    async delete(id: string): Promise<T | never> {
        const deleted = await this.dbRepo.delete(id, "userId");

        return deleted;
    }
}