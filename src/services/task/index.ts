import { DI } from "../../di";
import { TProject } from "../../models/project.model";
import { TTask } from "../../models/task.model";
import { TUser } from "../../models/user.model";
import { TaskRepository } from "../../repositories/mongo/task/task.repository";
import { UserService } from "../users";

export class TaskService {
    constructor(
        private readonly taskRepo: TaskRepository<TTask>
    ) {};

    async create(
        task: Partial<TTask>,
        userId: TUser["userId"],
        projectId: TProject["projectId"]
    ) {

        const userService = DI.resolve(UserService);

        if(!task?.assignedTo) {
            task.assignedTo = userId;
        }

        if(!task?.status) {
            task.status = "pending";
        }

        const newTask = await this.taskRepo.create({
            ...task,
            projectId,
            taskCreator: userId
        });

        const user = await userService.getUserById(newTask.taskCreator);

        let assignedUser: TUser | null = null;
        if(task.assignedTo !== userId) {
            assignedUser = await userService.getUserById(task.assignedTo);
        } else {
            assignedUser = user;
        }

        return {
            title: newTask.title,
            taskId: newTask.taskId,
            dueDate: newTask.dueDate,
            status: newTask.status,
            taskCreator: {
                name: user?.name,
                userId: user?.userId,
                email: user?.email
            },
            projectId: newTask.projectId,
            assignedTo: {
                name: assignedUser?.name,
                userId: assignedUser?.userId,
                email: assignedUser?.email
            },
            comments: newTask.comments,
            attachments: newTask.attachments,
            description: newTask.description       
        }
    }

    async getTaskById(
        taskId: TTask["taskId"]
    ) {
        return await this.taskRepo.findBy({taskId});
    }

    async getTasksByProjectId(
        projectId: TProject["projectId"]
    ) {
        return await this.taskRepo.findAllBy({projectId});
    }

    async getTasksByTaskId(
        taskId: TTask["taskId"]
    ) {
        return await this.taskRepo.findAllBy({taskId});
    }

    async updateTaskById(
        taskId: TTask["taskId"],
        data: Partial<TTask>
    ) {
        return await this.taskRepo.update(taskId, data);
    }

    async addCommentToTask(
        taskId: TTask["taskId"],
        comment: Record<TUser["userId"], string>
    ) {
        return await this.taskRepo.updateArray<typeof comment>(
            comment,
            "comments",
            taskId
        );
    }

    async addAttachmentToTask(
        taskId: TTask["taskId"],
        attachment: Record<TUser["userId"], string>
    ) {
        return await this.taskRepo.updateArray<typeof attachment>(
            attachment,
            "attachments",
            taskId
        );
    }

    async searchTextByProjectId(
        text: string,
        userId: TUser["userId"],
        projectId: TProject["projectId"]
    ) {
        const result = await this.taskRepo.searchText(text, {
            projectId,
            taskCreator: userId
        });

        const userService = DI.resolve(UserService);

        const transformedResult = await Promise.all(result.map(async (task) => {
            const creator = await userService.getUserById(task.taskCreator);
            let assignedToUser;

            if (task.assignedTo !== task.taskCreator) {
                assignedToUser = await userService.getUserById(task.assignedTo);
            } else {
                assignedToUser = creator;
            }

            return {
                title: task.title,
                taskId: task.taskId,
                taskCreator: {
                    name: creator?.name,
                    email: creator?.email,
                    userId: creator?.userId,
                },
                assignedTo: {
                    name: assignedToUser?.name,
                    email: assignedToUser?.email,
                    userId: assignedToUser?.userId,
                },
                dueDate: task.dueDate,
                comments: task.comments,
                projectId: task.projectId,
                attachments: task.attachments,
                description: task.description,
            };
        }));

        return transformedResult;
    }
}