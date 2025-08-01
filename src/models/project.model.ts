import { config } from "../configs";
import { SecId } from "@d3vtool/secid";
import mongoose, { InferSchemaType, Schema } from "mongoose";


const projectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    projectId: {
        type: String,
        required: true,
        immutable: true,
        default: () => SecId.generate(config.ID_LENGTH)
    },
    ownerId: {
        type: String,
        required: true
    },
    teamId: {
        type: String,
        required: true
    }
});

export type TProject = InferSchemaType<typeof projectSchema>;
export const Project = mongoose.model('Project', projectSchema);
