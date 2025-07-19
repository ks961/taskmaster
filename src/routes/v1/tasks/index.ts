import { Router } from "express";
import { DI } from "../../../di";
import { vUserId } from "../../../v-schemas/user";
import { vProjectId } from "../../../v-schemas/project";
import { validate } from "../../../middlewares/validate";
import { TasksController } from "../../../controllers/tasks";
import { MulterService } from "../../../services/upload/multer-service";
import { isAuthenticated } from "../../../middlewares/is-authenticated";
import { vCreateTask, vTaskAttachment, vTaskComment, vTaskId, vTaskStatus, vTaskText, vTaskUpdate } from "../../../v-schemas/task";

export const tasksRouter = Router();

tasksRouter.post("/:projectId", [
    isAuthenticated,
    validate(vProjectId, "params"),
    validate(vCreateTask, "body"),
    TasksController.create
]);

tasksRouter.get("/:projectId", [
    isAuthenticated,
    validate(vProjectId, "params"),
    validate(vTaskStatus, "query"),
    TasksController.list
]);

tasksRouter.patch("/:taskId", [
    isAuthenticated,
    validate(vTaskId, "params"),
    validate(vTaskUpdate, "body"),
    TasksController.update
]);

tasksRouter.post("/:taskId/assign", [
    isAuthenticated,
    validate(vTaskId, "params"),
    validate(vUserId, "body"),
    TasksController.assign
]);

tasksRouter.post("/:projectId/search", [
    isAuthenticated,
    validate(vProjectId, "params"),
    validate(vTaskText, "body"),
    TasksController.search
]);

tasksRouter.post("/:taskId/comment", [
    isAuthenticated,
    validate(vTaskId, "params"),
    validate(vTaskComment, "body"),
    TasksController.addComment
]);

const multerService = DI.resolve(MulterService);
tasksRouter.post("/:taskId/attachment", [
    isAuthenticated,
    validate(vTaskId, "params"),
    multerService.middleware(),
    TasksController.addAttachment
]);

tasksRouter.get("/:taskId/:attachment", [
    isAuthenticated,
    validate(vTaskId, "params"),
    validate(vTaskAttachment, "params"),
    TasksController.attachment
]);
