import { Validator } from "@d3vtool/utils";

export const task = {
    taskId: Validator.string().minLength(10),
    title: Validator.string().minLength(3),
    dueDate: Validator.string().regex(
        /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/([0-9]{4})$/, 
        "Date should be in dd/mm/yyyy format."
    ),
    assignedTo: Validator.string().minLength(10),
    description: Validator.string().minLength(5),
    status: Validator.string().custom((value) => {
        if(typeof value !== "string") return false;

        return ["pending", "completed"].includes(value);
    }, "Either 'pending' or 'completed' value is accepted for task status.")
}

export const vCreateTask = Validator.object({
    title: task.title,
    dueDate: task.dueDate,
    status: task.status.optional(),
    assignedTo: task.assignedTo.optional(),
    description: task.description.optional(),
});

export const vCreateTaskGenQuery = Validator.object({
    generateDescription: Validator.boolean().optional(),
});

export const vTaskId = Validator.object({
    taskId: task.taskId
});

export const vTaskText = Validator.object({
    text: Validator.string().minLength(3),
});

export const vTaskComment = Validator.object({
    comment: Validator.string().minLength(5),
});

export const vTaskStatus = Validator.object({
    status: task.status.optional(),
});

export const vTaskAttachment = Validator.object({
    attachment: Validator.string().minLength(3),
});

export const vTaskUpdate = Validator.object({
    title: task.title.optional(),
    dueDate: task.dueDate.optional(),
    description: task.dueDate.optional(),
    status: task.status.optional(),
    assignedTo: task.assignedTo.optional()
});