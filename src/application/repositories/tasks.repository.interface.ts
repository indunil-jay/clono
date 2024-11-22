import { TasksCollectionDocument } from "@/src/entities/task.entity";
import { DocumentList } from "@/src/entities/workspace.entity";

export interface ITasksRepository {
  getWorkspaceTasks(
    workspaceId: string,
    filter?: string[]
  ): Promise<DocumentList<TasksCollectionDocument>>;
}
