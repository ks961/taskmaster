import { SecId } from "@d3vtool/secid";
import mongoose, { InferSchemaType, mongo, Schema } from "mongoose";


const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    taskId: {
        type: String,
        required: true,
        immutable: true,
        default: () => SecId.generate(10)
    },
    dueDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

export type TTask = InferSchemaType<typeof taskSchema>;
export const Task = mongoose.model('Task', taskSchema);
