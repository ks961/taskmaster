import { v1Router } from "..";
import { Router } from "express";
import { UserController } from "../../../controllers/users";
import { isAuthenticated } from "../../../middlewares/isAuthenticated";

export const usersRouter = Router();

// TODO: Add validation check for incoming payloads.

usersRouter.get("/", [
    isAuthenticated,
    UserController.profile
]);

usersRouter.patch("/", [
    isAuthenticated,
    UserController.updateProfile
]);

usersRouter.post("/signup", [
    UserController.signup
]);

usersRouter.post("/login", [
    UserController.login
]);


usersRouter.post("/logout", [
    isAuthenticated,
    UserController.logout
]);
