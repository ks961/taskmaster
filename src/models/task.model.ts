import { SecId } from "@d3vtool/secid";
import { config } from "../configs";
import mongoose, { InferSchemaType, Schema } from "mongoose";


const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    taskId: {
        type: String,
        required: true,
        immutable: true,
        default: () => SecId.generate(config.ID_LENGTH)
    },
    projectId: {
        type: String,
        required: true
    },
    taskCreator: {
        type: String,
        required: true,
    },
    assignedTo: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [ "pending", "completed" ],
        required: true
    },
    dueDate: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    comments: {
        type: [Schema.Types.Mixed]
    },
    attachments: {
        type: [Schema.Types.Mixed]
    }
});

taskSchema.index({ title: 'text', description: 'text' });
export type TTask = InferSchemaType<typeof taskSchema>;
export const Task = mongoose.model('Task', taskSchema);
