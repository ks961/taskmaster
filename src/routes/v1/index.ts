import { Router } from "express";
import { usersRouter } from "./users";
import { teamsRouter } from "./teams";
import { tasksRouter } from "./tasks";
import { projectsRouter } from "./projects";

export const v1Router = Router();

v1Router.use("/users", usersRouter);
v1Router.use("/teams", teamsRouter);
v1Router.use("/tasks", tasksRouter);
v1Router.use("/projects", projectsRouter);
