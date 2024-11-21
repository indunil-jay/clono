import { updateWorkspaceInviteCodeUseCase } from "@/src/application/use-cases/workspaces/update-workspace-invite-code.use-case";
import { WorkspaceCollectionDocument } from "@/src/entities/workspace.entity";

const presenter = (collection: WorkspaceCollectionDocument) => {
  return {
    workspaceId: collection.$id,
    inviteCode: collection.inviteCode,
  };
};

export type updateWorkspaceInviteCodeControllerResponse = ReturnType<
  typeof presenter
>;

export const updateWorkspaceInviteCodeController = async (
  workspaceId: string
): Promise<updateWorkspaceInviteCodeControllerResponse> => {
  const collection = await updateWorkspaceInviteCodeUseCase(workspaceId);
  return presenter(collection);
};
