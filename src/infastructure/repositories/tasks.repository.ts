import { injectable } from "inversify";
import { Query } from "node-appwrite";

import { ITasksRepository } from "@/src/application/repositories/tasks.repository.interface";
import { TasksCollectionDocument } from "@/src/entities/task.entity";
import { DocumentList } from "@/src/entities/workspace.entity";
import { createSessionClient } from "@/src/lib/appwrite/appwrite";
import { DATABASE_ID, TASKS_COLLECTION_ID } from "@/src/lib/constants";

@injectable()
export class TasksRepository implements ITasksRepository {
  public async getWorkspaceTasks(
    workspaceId: string,
    filter?: string[]
  ): Promise<DocumentList<TasksCollectionDocument>> {
    const { databases } = await createSessionClient();

    const queries = [Query.equal("workspaceId", workspaceId)];

    if (filter) {
      queries.push(...filter);
    }

    return await databases.listDocuments(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      queries
    );
  }
}
