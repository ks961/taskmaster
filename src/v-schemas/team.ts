import { Validator } from "@d3vtool/utils";

export const team = {
    name: Validator.string().minLength(3),
    teamId: Validator.string().minLength(10)
}

export const vCreateTeam = Validator.object({
    name: team.name
});

export const vTeamId = Validator.object({
    teamId: team.teamId
});

export const vInviteMembers = Validator.object({
    members: Validator.array().minLength(1)
});
