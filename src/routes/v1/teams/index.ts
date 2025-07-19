import { Router } from "express";
import { validate } from "../../../middlewares/validate";
import { TeamsController } from "../../../controllers/teams";
import { vCreateTeam, vTeamId, vInviteMembers } from "../../../v-schemas/team";
import { isAuthenticated } from "../../../middlewares/is-authenticated";

export const teamsRouter = Router();

teamsRouter.post("/", [
    isAuthenticated,
    validate(vCreateTeam, "body"),
    TeamsController.create
]);

teamsRouter.get("/invites", [
    isAuthenticated,
    TeamsController.pendingInvitation
]);

teamsRouter.get("/:teamId", [
    isAuthenticated,
    validate(vTeamId, "params"),
    TeamsController.members
]);

teamsRouter.post("/:teamId/invite", [
    isAuthenticated,
    validate(vTeamId, "params"),
    validate(vInviteMembers, "body"),
    TeamsController.invite
]);

teamsRouter.post("/:teamId/join", [
    isAuthenticated,
    validate(vTeamId, "params"),
    TeamsController.join
]);