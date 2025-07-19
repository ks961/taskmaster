import { Router } from "express";
import { UserController } from "../../../controllers/users";
import { isAuthenticated } from "../../../middlewares/is-authenticated";
import { validate } from "../../../middlewares/validate";
import { vLoginCreds, vSignupCreds, vUpdateUser } from "../../../v-schemas/user";

export const usersRouter = Router();

usersRouter.get("/", [
    isAuthenticated,
    UserController.profile
]);

usersRouter.patch("/", [
    isAuthenticated,
    validate(vUpdateUser, "body"),
    UserController.updateProfile
]);

usersRouter.post("/signup", [
    validate(vSignupCreds, "body"),
    UserController.signup
]);

usersRouter.post("/login", [
    validate(vLoginCreds, "body"),
    UserController.login
]);


usersRouter.get("/logout", [
    isAuthenticated,
    UserController.logout
]);
