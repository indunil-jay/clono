import {
  TasksCollectionDocument,
  TasksCollectionInput,
  TasksQuery,
  UpdateTaskFromInput,
} from "@/src/entities/task.entity";
import { DocumentList } from "@/src/entities/workspace.entity";

export interface ITasksRepository {
  getWorkspaceTasks(
    workspaceId: string,
    filter?: {
      query?: Omit<TasksQuery, "workspaceId">;
      limit?: number;
      orderAsc?: keyof TasksQuery | "position";
      orderDesc?: keyof TasksQuery | "position";
    }
  ): Promise<DocumentList<TasksCollectionDocument>>;

  create(taskObj: TasksCollectionInput): Promise<TasksCollectionDocument>;

  getById(taskId: string): Promise<TasksCollectionDocument>;

  delete(taskId: string): Promise<void>;

  update(
    taskId: string,
    taskObj: UpdateTaskFromInput
  ): Promise<TasksCollectionDocument>;
}
