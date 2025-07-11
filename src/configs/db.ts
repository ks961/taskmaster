import { config } from ".";
import mongoose from "mongoose";


export async function connectDB() {
    if(!config.MONGO_URI) {
        throw new Error("Mongo uri not found");
    }
    await mongoose.connect(config.MONGO_URI);
    console.log("MongoDB connected.");
}
