import { Request, Response } from "express";
import { TaskService } from "../../services/task";
import { DI } from "../../di";
import { ClientError } from "../../errors/error-classes/client-error";
import { HttpClientError, HttpServerError, HttpSuccess } from "../../libs/http-response-codes";
import { UserService } from "../../services/users";
import { MulterService } from "../../services/upload/multer-service";
import { ServerError } from "../../errors/error-classes/server-error";
import path from "node:path";
import { ChatAI } from "../../services/chat-ai/ChatAI";
import { GPTResponse } from "../../services/chat-ai/chatgpt-service";
import { retry } from "../../libs/retry";
import { Socket } from "socket.io";
import { SockMap } from "../../services/sock-map";

export class TasksController {

    // In its validator the assignedTo field should be optional
    // if field not found then the task will be assigned to creator.

    static async create(
        req: Request,
        res: Response
    ) {
        const taskInfo = req.body;
        const projectId = req.params.projectId;
        const generateDescription = (req.query.generateDescription === "true");

        const userId = (req as any).claims.userId;

        const chatAI = DI.resolve(ChatAI<GPTResponse>);

        if(!(taskInfo?.description) && taskInfo.title && generateDescription) {
            
            // Note: will retry 2 times on fail, and sleep in b/w calls.
            const result = await retry(
                () => chatAI.ask(`Task title: ${taskInfo.title}`),
                2
            );

            if(result === null) {
                throw new ServerError(
                    "Something went wrong while generating description for task.",
                    HttpServerError.InternalServerError
                );
            }
            taskInfo.description = result.description;
        } else if(!(taskInfo?.description) && !generateDescription) {
            throw new ClientError(
                "The 'description' field is missing from the task creation request payload.",
                HttpClientError.BadRequest
            );
        }

        const taskService = DI.resolve(TaskService);
        const newTask = await taskService.create(
            taskInfo,
            userId,
            projectId
        );

        res.status(HttpSuccess.Created.statusCode).json({
            status: "success",
            task: newTask
        });
    }

    static async list(
        req: Request,
        res: Response
    ) {
        const projectId = req.params.projectId;
        const filterByStatus = req.query.status;

        const taskService = DI.resolve(TaskService);
        let tasks = await taskService.getTasksByProjectId(projectId);

        if(filterByStatus) {
            tasks = tasks.filter(task => task.status === filterByStatus);
        }

        if(!tasks) {
            throw new ClientError(
                `There no tasks found for project '${projectId}'.`,
                HttpClientError.NotFound
            );
        }

        const userService = DI.resolve(UserService);
        
        const transformedTasks = await Promise.all(tasks.map(async (task) => {
            const taskCreatorPromise = userService.getUserById(task.taskCreator);
            const assignedToPromise = task.taskCreator !== task.assignedTo
                ? userService.getUserById(task.assignedTo)
                : taskCreatorPromise;

            const [taskCreator, taskAssignedTo] = await Promise.all([taskCreatorPromise, assignedToPromise]);

            return {
                title: task.title,
                taskId: task.taskId,
                dueDate: task.dueDate,
                taskCreator: {
                    name: taskCreator?.name,
                    userId: taskCreator?.userId,
                    email: taskCreator?.email
                },
                projectId: task.projectId,
                assignedTo: {
                    name: taskAssignedTo?.name,
                    userId: taskAssignedTo?.userId,
                    email: taskAssignedTo?.email
                },
                comments: task.comments,
                description: task.description,
                attachments: task.attachments,
            };
        }));

        res.json({
            status: "success",
            tasks: transformedTasks
        });

    }
    
    static async update(
        req: Request,
        res: Response
    ) {
        const taskId = req.params.taskId;
        const updateData = req.body;
        
        const userId = (req as any).claims.userId;

        const taskService = DI.resolve(TaskService);
        await taskService.updateTaskById(taskId, updateData);

        const sockMap = DI.resolve(SockMap);

        const socket = sockMap.get(userId);

        socket?.emit(`task:updated`, updateData);

        res.json({
            status: "success"
        });
    }
    
    static async assign(
        req: Request,
        res: Response
    ) {
        const taskId = req.params.taskId;
        const userId = req.body.userId;
        
        const taskService = DI.resolve(TaskService)

        const updatePayload = {
            assignedTo: userId
        };

        const task = await taskService.updateTaskById(taskId, updatePayload);

        const sockMap = DI.resolve(SockMap);

        const socket = sockMap.get(userId);

        socket?.emit(`task:assigned`, task);

        res.json({
            status: "success"
        });
    }
    
    static async search(
        req: Request,
        res: Response
    ) {
        const text = req.body.text;
        const projectId = req.params.projectId;
        const userId = (req as any).claims.userId;
        
        const taskService = DI.resolve(TaskService);
        const result = await taskService.searchTextByProjectId(
            text,
            userId,
            projectId
        );
    
        res.json({
            status: "success",
            tasks: result
        });
    }

    static async addComment(
        req: Request,
        res: Response
    ) {
        const comment = req.body.comment;
        const taskId = req.params.taskId;
        const userId = (req as any).claims.userId;
        
        const taskService = DI.resolve(TaskService);

        await taskService.addCommentToTask(taskId, {
            [userId]: comment
        });

        res.json({
            status: "success"
        });
    }

    static async addAttachment(
        req: Request,
        res: Response
    ) {
        const taskId = req.params.taskId;
        const userId = (req as any).claims.userId;

        const taskService = DI.resolve(TaskService);

        const task = await taskService.getTaskById(taskId);

        if(!task) {
            throw new ClientError(
                `Task Id '${taskId}' does not exists.`,
                HttpClientError.NotFound
            );
        }

        const multerService = DI.resolve(MulterService);
        const result = await multerService.wasSuccess(req, res);

        if(!result.exists) {
            throw new ServerError(
                `Something went wrong while uploading the attachment ${req.file?.filename}`,
                HttpServerError.InternalServerError
            );
        }

        await taskService.addAttachmentToTask(
            taskId,
            { [userId]: result.filename! }
        );

        res.json({
            status: "success"
        });
    }

    static async attachment(
        req: Request,
        res: Response
    ) {
        const taskId = req.params.taskId;
        const attachment = req.params.attachment;

        const taskService = DI.resolve(TaskService);
        const task = await taskService.getTaskById(taskId);
        if(!task) {
            throw new ClientError(
                `Not attachement found for '${attachment}'.`,
                HttpClientError.NotFound
            );
        }
        
        const index = task.attachments
           .findIndex(att => Object.values(att).includes(attachment));
    
        if(index === -1) {
            throw new ClientError(
                `Not attachement found for '${attachment}'.`,
                HttpClientError.NotFound
            );
        }
        

        const filepath = path.join(process.cwd(), "uploads", attachment);

        res.sendFile(filepath);
    }
}
