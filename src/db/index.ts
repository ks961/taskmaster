import mongoose from "mongoose";

export class Database {
    private static instance: typeof mongoose | null = null;
    private constructor() {};

    static async connect(
        uri: string
    ) {
        if(Database.instance) return Database.instance;

        Database.instance = await mongoose.connect(uri);
        return Database.instance;
    }
}