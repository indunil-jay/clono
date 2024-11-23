import { updateMemberRoleInWorkspaceUseCase } from "@/src/application/use-cases/members/update-member-role-in-workspace";

export const updateWorkspaceMemberRoleController = async ({
  memberId,
  workspaceId,
}: {
  memberId: string;
  workspaceId: string;
}) => {
  return await updateMemberRoleInWorkspaceUseCase({ memberId, workspaceId });
};
