import { Router } from "express";
import { TasksController } from "../../../controllers/tasks";
import { isAuthenticated } from "../../../middlewares/isAuthenticated";

export const tasksRouter = Router();

// TODO: Add validation check for incoming payloads.

tasksRouter.post("/create", [
    isAuthenticated,
    TasksController.create
]);

/**
 * Note: This routes controller will also be responsbile for 
 * fetching either all or filtering based on status query.
 */
tasksRouter.get("/", [
    isAuthenticated,
    TasksController.list
]);

tasksRouter.patch("/:taskId", [
    isAuthenticated,
    TasksController.update
]);

tasksRouter.post("/assign", [
    isAuthenticated,
    TasksController.assign
]);

tasksRouter.post("/search", [
    isAuthenticated,
    TasksController.search
]);

tasksRouter.post("/:taskId/comment", [
    isAuthenticated,
    TasksController.addComment
]);

tasksRouter.post("/:taskId/attachment", [
    isAuthenticated,
    TasksController.addAttachment
]);
