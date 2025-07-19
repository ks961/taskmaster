import { SecId } from "@d3vtool/secid";
import mongoose, { InferSchemaType, Schema } from "mongoose";
import { User } from "./user.model";
import { config } from "../configs";


const teamSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    teamId: {
        type: String,
        required: true,
        immutable: true,
        default: () => SecId.generate(config.ID_LENGTH)
    },
    members: [
        {
            type: String,
            required: true
        }
    ]
});

export type TTeam = InferSchemaType<typeof teamSchema>;
export const Team = mongoose.model('Team', teamSchema);
