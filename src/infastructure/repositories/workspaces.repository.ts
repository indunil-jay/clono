import { IWorkspacesRepository } from "@/src/application/repositories/workspaces.repository.interface";
import { Workspace } from "@/src/entities/workspace.entity";
import {
  DATABASE_ID,
  MEMBERS_COLLECTION_ID,
  WORKSPACE_COLLECTION_ID,
} from "@/src/lib/constants";
import { Context } from "hono";
import { injectable } from "inversify";
import { Query } from "node-appwrite";

interface AppwriteDocumentResponse<T> {
  documents: T[];
  total: number;
}

@injectable()
export class WorkspacesRepository implements IWorkspacesRepository {
  constructor() {}

  async getAll(ctx: Context): Promise<AppwriteDocumentResponse<Workspace>> {
    try {
      const user = ctx.get("user");
      const databases = ctx.get("databases");

      // Fetch all members the user is part of
      const members: AppwriteDocumentResponse<{ workspaceId: string }> =
        await databases.listDocuments(DATABASE_ID, MEMBERS_COLLECTION_ID, [
          Query.equal("userId", user.$id),
        ]);

      // Return empty data if the user is not part of any workspace
      if (members.total === 0) {
        return { documents: [], total: 0 };
      }

      const workspaceIds = members.documents.map(
        (member) => member.workspaceId
      );

      // Fetch workspaces
      const workspaces: AppwriteDocumentResponse<Workspace> =
        await databases.listDocuments(DATABASE_ID, WORKSPACE_COLLECTION_ID, [
          Query.contains("$id", workspaceIds),
          Query.orderDesc("$createdAt"),
        ]);

      return workspaces;
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      throw new Error("Failed to fetch workspaces");
    }
  }
}
