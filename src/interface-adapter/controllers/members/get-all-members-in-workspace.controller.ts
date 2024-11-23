import { getAllMembersInWorkspaceUseCase } from "@/src/application/use-cases/members/get-all-members-in-workspace.use-case";

export const getAllMembersInWorkspaceController = async (
  workspaceId: string
) => {
  return await getAllMembersInWorkspaceUseCase(workspaceId);
};
