import { Router } from "express";
import { usersRouter } from "./users";
import { teamRouter } from "./teams";
import { tasksRouter } from "./tasks";
import { projectRouter } from "./projects";

export const v1Router = Router();

v1Router.use("/team", teamRouter);
v1Router.use("/users", usersRouter);
v1Router.use("/tasks", tasksRouter);
v1Router.use("/project", projectRouter);
