import { deleteMemberInWorkspaceUseCase } from "@/src/application/use-cases/members/delete-member-in-workspace.use-case";

export const deleteMemberInWorkspaceController = async (
  memberId: string,
  workspaceId: string
) => {
  await deleteMemberInWorkspaceUseCase(memberId, workspaceId);
};
