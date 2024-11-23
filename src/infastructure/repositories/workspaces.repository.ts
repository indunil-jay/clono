import { injectable } from "inversify";
import { ID, Query } from "node-appwrite";

import { IWorkspacesRepository } from "@/src/application/repositories/workspaces.repository.interface";
import { DATABASE_ID, WORKSPACE_COLLECTION_ID } from "@/src/lib/constants";
import {
  DocumentList,
  WorkspaceCollectionDocument,
  WorkspacesCollectionInput,
  WorkspacesCollectionUpdateInput,
} from "@/src/entities/workspace.entity";
import { createSessionClient } from "@/src/lib/appwrite/appwrite";

@injectable()
export class WorkspacesRepository implements IWorkspacesRepository {
  constructor() {}

  public async getworkspaceById(
    workspaceId: string
  ): Promise<WorkspaceCollectionDocument> {
    const { databases } = await createSessionClient();

    return await databases.getDocument(
      DATABASE_ID,
      WORKSPACE_COLLECTION_ID,
      workspaceId
    );
  }

  public async create(
    workspaceObj: WorkspacesCollectionInput
  ): Promise<WorkspaceCollectionDocument> {
    const { databases } = await createSessionClient();

    return await databases.createDocument(
      DATABASE_ID,
      WORKSPACE_COLLECTION_ID,
      ID.unique(),
      workspaceObj
    );
  }

  public async update(
    workspaceObj: WorkspacesCollectionUpdateInput,
    workspaceId: string
  ): Promise<WorkspaceCollectionDocument> {
    const { databases } = await createSessionClient();

    return await databases.updateDocument(
      DATABASE_ID,
      WORKSPACE_COLLECTION_ID,
      workspaceId,
      {
        name: workspaceObj.name,
        imageUrl: workspaceObj.imageUrl,
        inviteCode: workspaceObj.inviteCode,
        userId: workspaceObj.userId,
      }
    );
  }

  public async getAllByUser(
    userId: string
  ): Promise<DocumentList<WorkspaceCollectionDocument>> {
    const { databases } = await createSessionClient();

    return await databases.listDocuments(DATABASE_ID, WORKSPACE_COLLECTION_ID, [
      Query.equal("userId", userId),
      Query.orderDesc("$createdAt"),
    ]);
  }

  public async getWorkspacesByIds(
    worspacesIds: string[]
  ): Promise<DocumentList<WorkspaceCollectionDocument>> {
    const { databases } = await createSessionClient();

    return await databases.listDocuments(DATABASE_ID, WORKSPACE_COLLECTION_ID, [
      Query.contains("$id", worspacesIds),
      Query.orderDesc("$createdAt"),
    ]);
  }

  public async delete(workspaceId: string): Promise<void> {
    const { databases } = await createSessionClient();
    await databases.deleteDocument(
      DATABASE_ID,
      WORKSPACE_COLLECTION_ID,
      workspaceId
    );
  }
}
