import { Router } from "express";
import { isAuthenticated } from "../../../middlewares/isAuthenticated";
import { ProjectsController } from "../../../controllers/projects";

export const projectsRouter = Router();

/**
 * Note: We can pick up userId of user creating the team from jwt info
*/
projectsRouter.get("/:teamId", [
    isAuthenticated,
    ProjectsController.projects
]);

projectsRouter.post("/:teamId", [
    // isAuthenticated,
    ProjectsController.create
]);

projectsRouter.post("/:projectId/invite", [
    isAuthenticated,
    ProjectsController.invite
]);
