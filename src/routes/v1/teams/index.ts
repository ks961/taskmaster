import { v1Router } from "..";
import { Router } from "express";
import { TeamsController } from "../../../controllers/teams";
import { isAuthenticated } from "../../../middlewares/isAuthenticated";

export const teamRouter = Router();

/**
 * Note: We can pick up userId of user creating the team from jwt info
*/
teamRouter.post("/", [
    isAuthenticated,
    TeamsController.create
]);

teamRouter.get("/", [
    isAuthenticated,
    TeamsController.members
]);

teamRouter.get("/:teamId/invite", [
    isAuthenticated,
    TeamsController.members
]);
