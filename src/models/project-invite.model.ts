import { config } from "../configs";
import { SecId } from "@d3vtool/secid";
import mongoose, { InferSchemaType, Schema } from "mongoose";

export const projectInviteSchema = new Schema({
    inviteId: {
        type: String,
        required: true,
        default: () => SecId.generate(config.ID_LENGTH)
    },
    userId: {
        type: String,
        required: true
    },
    projects: {
        type: [String],
        required: true
    }
});


export type TProjectInvite = InferSchemaType<typeof projectInviteSchema>;
export const ProjectInvite = mongoose.model('ProjectInvite', projectInviteSchema);