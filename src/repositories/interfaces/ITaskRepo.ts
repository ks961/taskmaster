import { TTask } from "../../models/task.model";
import { ICrudRepo, IReadRepo, IWriteRepo } from "./ICommonRepo";


export interface ITaskRepo extends ICrudRepo<TTask> {};