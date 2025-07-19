import { config } from "../configs";
import { SecId } from "@d3vtool/secid";
import mongoose, { InferSchemaType, Schema } from "mongoose";

export const inviteSchema = new Schema({
    inviteId: {
        type: String,
        required: true,
        default: () => SecId.generate(config.ID_LENGTH)
    },
    userId: {
        type: String,
        required: true
    },
    teams: {
        type: [String],
        required: true
    }
});


export type TInvite = InferSchemaType<typeof inviteSchema>;
export const Invite = mongoose.model('Invite', inviteSchema);