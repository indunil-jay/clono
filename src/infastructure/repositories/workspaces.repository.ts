import { injectable } from "inversify";
import { ID } from "node-appwrite";

import { IWorkspacesRepository } from "@/src/application/repositories/workspaces.repository.interface";
import { DATABASE_ID, WORKSPACE_COLLECTION_ID } from "@/src/lib/constants";
import {
  WorkspaceCollectionDocument,
  WorkspacesCollectionInput,
} from "@/src/entities/workspace.entity";
import { createSessionClient } from "@/src/lib/appwrite/appwrite";

@injectable()
export class WorkspacesRepository implements IWorkspacesRepository {
  constructor() {}

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
}
