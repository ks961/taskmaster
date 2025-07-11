import { Router } from "express";
import { TeamsController } from "../../../controllers/teams";
import { isAuthenticated } from "../../../middlewares/isAuthenticated";

export const teamsRouter = Router();

/**
 * Note: We can pick up userId of user creating the team from jwt info
*/
teamsRouter.post("/", [
    isAuthenticated,
    TeamsController.create
]);

teamsRouter.get("/", [
    isAuthenticated,
    TeamsController.members
]);

teamsRouter.get("/:teamId/invite", [
    isAuthenticated,
    TeamsController.invite
]);
