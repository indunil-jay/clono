import { getAllWorkspacesWithCurrentUserUseCase } from "@/src/application/use-cases/workspaces/get-all-workspaces-by-user.use-case";
import {
  DocumentList,
  WorkspaceCollectionDocument,
} from "@/src/entities/workspace.entity";

const presenter = (collections: DocumentList<WorkspaceCollectionDocument>) => {
  return {
    total: collections.total,
    workspaces: collections.documents,
  };
};

export type getAllWorkspacesWithCurrentUserControllerResponse = ReturnType<
  typeof presenter
>;

export const getAllWorkspacesWithCurrentUserController =
  async (): Promise<getAllWorkspacesWithCurrentUserControllerResponse> => {
    const collections = await getAllWorkspacesWithCurrentUserUseCase();
    return presenter(collections);
  };
