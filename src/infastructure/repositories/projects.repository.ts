import { injectable } from "inversify";
import { ID, Query } from "node-appwrite";
import { createSessionClient } from "@/src/lib/appwrite/appwrite";

import { IProjectRepository } from "@/src/application/repositories/projects.repository.interface";
import {
  ProjectsCollectionInput,
  ProjectsCollectionUpdateInput,
  ProjectseCollectionDocument,
} from "@/src/entities/project.entity";
import { DATABASE_ID, PROJECTS_COLLECTION_ID } from "@/src/lib/constants";
import { DocumentList } from "@/src/entities/workspace.entity";

@injectable()
export class ProjectRepository implements IProjectRepository {
  public async delete(projectId: string): Promise<void> {
    const { databases } = await createSessionClient();
    await databases.deleteDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      projectId
    );
  }

  public async update(
    projectId: string,
    projectObj: ProjectsCollectionUpdateInput
  ): Promise<ProjectseCollectionDocument> {
    const { databases } = await createSessionClient();
    return await databases.updateDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      projectId,
      { name: projectObj.name, imageUrl: projectObj.imageUrl }
    );
  }

  public async getById(
    projectId: string
  ): Promise<ProjectseCollectionDocument> {
    const { databases } = await createSessionClient();
    return await databases.getDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      projectId
    );
  }

  public async getAllByWorkspaceId(
    workspaceId: string
  ): Promise<DocumentList<ProjectseCollectionDocument>> {
    const { databases } = await createSessionClient();

    return await databases.listDocuments(DATABASE_ID, PROJECTS_COLLECTION_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.orderDesc("$createdAt"),
    ]);
  }

  public async create(
    data: ProjectsCollectionInput
  ): Promise<ProjectseCollectionDocument> {
    const { databases } = await createSessionClient();

    return await databases.createDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      ID.unique(),

      {
        name: data.name,
        imageUrl: data.imageUrl,
        workspaceId: data.workspaceId,
      }
    );
  }
}
