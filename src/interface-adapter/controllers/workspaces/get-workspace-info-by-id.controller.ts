import { getWorkspaceByIdUseCase } from "@/src/application/use-cases/workspaces/get-workspace-by-id.use-case";
import { WorkspaceCollectionDocument } from "@/src/entities/workspace.entity";

const presenter = (collection: WorkspaceCollectionDocument) => {
  return {
    workspaceId: collection.$id,
    name: collection.name,
    imageUrl: collection.imageUrl,
    userId: collection.userId,
  };
};

export type getWorkspaceInfoByIdControllerResponse = ReturnType<
  typeof presenter
>;

export const getWorkspaceInfoByIdController = async (
  workspaceId: string
): Promise<getWorkspaceInfoByIdControllerResponse> => {
  const workspaceCollectionDocument = await getWorkspaceByIdUseCase(
    workspaceId
  );
  return presenter(workspaceCollectionDocument);
};
