import { injectable } from "inversify";
import { ID, Query } from "node-appwrite";

import { ITasksRepository } from "@/src/application/repositories/tasks.repository.interface";
import {
  TasksCollectionDocument,
  TasksCollectionInput,
  TasksQuery,
  UpdateTaskFromInput,
} from "@/src/entities/task.entity";
import { DocumentList } from "@/src/entities/workspace.entity";
import { createSessionClient } from "@/src/tools/lib/appwrite/appwrite";
import { DATABASE_ID, TASKS_COLLECTION_ID } from "@/src/tools/lib/constants";

@injectable()
export class TasksRepository implements ITasksRepository {
  public async update(
    taskId: string,
    taskObj: UpdateTaskFromInput
  ): Promise<TasksCollectionDocument> {
    const { databases } = await createSessionClient();

    return await databases.updateDocument(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      taskId,
      taskObj
    );
  }

  public async delete(taskId: string): Promise<void> {
    const { databases } = await createSessionClient();
    await databases.deleteDocument(DATABASE_ID, TASKS_COLLECTION_ID, taskId);
  }

  public async getById(taskId: string): Promise<TasksCollectionDocument> {
    const { databases } = await createSessionClient();

    return await databases.getDocument(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      taskId
    );
  }

  public async create(
    taskObj: TasksCollectionInput
  ): Promise<TasksCollectionDocument> {
    const { databases } = await createSessionClient();

    return await databases.createDocument(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      ID.unique(),
      taskObj
    );
  }

  public async getWorkspaceTasks(
    workspaceId: string,
    filter?: {
      query?: Omit<TasksQuery, "workspaceId">;
      limit?: number;
      orderAsc?: keyof TasksQuery | "position";
      orderDesc?: keyof TasksQuery | "position";
    }
  ): Promise<DocumentList<TasksCollectionDocument>> {
    const { databases } = await createSessionClient();

    const queries = [
      Query.equal("workspaceId", workspaceId),
      Query.orderDesc("$createdAt"),
    ];

    if (filter?.query?.projectId) {
      queries.push(Query.equal("projectId", filter.query.projectId));
    }

    if (filter?.query?.status) {
      queries.push(Query.equal("status", filter.query.status));
    }

    if (filter?.query?.assigneeId) {
      queries.push(Query.equal("assigneeId", filter.query.assigneeId));
    }
    if (filter?.query?.dueDate) {
      queries.push(Query.equal("dueDate", filter.query.dueDate));
    }
    if (filter?.query?.search) {
      queries.push(Query.search("name", filter.query.search));
    }

    if (filter?.limit) {
      queries.push(Query.limit(filter.limit));
    }

    if (filter?.orderAsc) {
      queries.push(Query.orderAsc(filter.orderAsc));
    }
    if (filter?.orderDesc) {
      queries.push(Query.orderDesc(filter.orderDesc));
    }

    return await databases.listDocuments(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      queries
    );
  }
}
