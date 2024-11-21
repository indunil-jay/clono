import { deleteWorkspaceUseCase } from "@/src/application/use-cases/workspaces/delete-workspace.use-case";

export const deleteWorkspaceController = async (workspaceId: string) => {
  await deleteWorkspaceUseCase(workspaceId);
};
