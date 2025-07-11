import { v1Router } from "..";
import { Router } from "express";
import { isAuthenticated } from "../../../middlewares/isAuthenticated";
import { ProjectsController } from "../../../controllers/projects";

export const projectRouter = Router();

/**
 * Note: We can pick up userId of user creating the team from jwt info
*/
projectRouter.get("/:teamId", [
    isAuthenticated,
    ProjectsController.projects
]);

projectRouter.post("/:teamId", [
    isAuthenticated,
    ProjectsController.create
]);

projectRouter.post("/:projectId/invite", [
    isAuthenticated,
    ProjectsController.invite
]);
