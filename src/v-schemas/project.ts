import { Validator } from "@d3vtool/utils";

const project = {
    name: Validator.string().minLength(3),
    projectId: Validator.string().minLength(10),
}

export const vCreateProject = Validator.object({
    name: project.name
});

export const vProjectId = Validator.object({
    projectId: project.projectId
});

export const vProjectInviteBody = Validator.object({
    userIds: Validator.array<string[]>().minLength(1),
});