import { Router } from "express";
import { vTeamId } from "../../../v-schemas/team";
import { validate } from "../../../middlewares/validate";
import { ProjectsController } from "../../../controllers/projects";
import { isAuthenticated } from "../../../middlewares/is-authenticated";
import { vCreateProject, vProjectId, vProjectInviteBody } from "../../../v-schemas/project";

export const projectsRouter = Router();

projectsRouter.get("/:teamId", [
    isAuthenticated,
    validate(vTeamId, "params"),
    ProjectsController.projects
]);

projectsRouter.post("/:teamId", [
    isAuthenticated,
    validate(vTeamId, "params"),
    validate(vCreateProject, "body"),
    ProjectsController.create
]);

projectsRouter.post("/:projectId/invite", [
    isAuthenticated,
    validate(vProjectId, "params"),
    validate(vProjectInviteBody, "body"),
    ProjectsController.invite
]);

projectsRouter.post("/:projectId/join", [
    isAuthenticated,
    validate(vProjectId, "params"),
    ProjectsController.join
]);
