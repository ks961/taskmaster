import { Redis } from "ioredis";
import { IMemDb } from "./interface";


export class RedisService implements IMemDb {
    private client: Redis;

    constructor(
        uri: string
    ) {
        this.client = new Redis(uri);
    }

    async get<T>(key: string): Promise<T | null> {
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : null;
    }

    async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
        if(ttlSeconds) {
            await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
            return;
        }
        await this.client.set(key, JSON.stringify(value));
    }

    async delete(key: string): Promise<void> {
        await this.client.del(key);
    }

    async has(key: string): Promise<boolean> {
        const exists = await this.client.exists(key);
        return exists === 1;
    }

}