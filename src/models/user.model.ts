import { SecId } from "@d3vtool/secid";
import mongoose, { InferSchemaType, Schema } from "mongoose";

export const userSchema = new Schema({
    name: {
        type: String, 
        required: true
    },
    userId: {
        type: String, 
        required: true,
        immutable: true,
        default: () => SecId.generate(10), 
    },
    email: {
        type: String, 
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

export type TUser = InferSchemaType<typeof userSchema>; 
export const User = mongoose.model('User', userSchema);
