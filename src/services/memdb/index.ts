import { IMemDb } from "./interface";


export class MemDB implements IMemDb {
    constructor(
        private readonly memdb: IMemDb
    ){};

    async get<T>(key: string): Promise<T | null> {
        return await this.memdb.get(key);
    }

    async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
        await this.memdb.set(key, value, ttlSeconds); 
    }

    async delete(key: string): Promise<void> {
        await this.memdb.delete(key);
    }
    
    async has(key: string): Promise<boolean> {
        return await this.memdb.has(key);
    }
}