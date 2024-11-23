import { getInjection } from "@/DI/container";
import { MemberRole } from "@/src/entities/member.enum";
import { createSessionClient } from "@/src/lib/appwrite/appwrite";

export const updateMemberRoleInWorkspaceUseCase = async ({
  memberId,
  workspaceId,
}: {
  memberId: string;
  workspaceId: string;
}) => {
  //admin can change the workspace ownership
  const { account } = await createSessionClient();
  const user = await account.get();

  const workspacesRepository = getInjection("IWorkspacesRepository");
  const workspaceCollectionDocument =
    await workspacesRepository.getworkspaceById(workspaceId);

  if (workspaceCollectionDocument.userId !== user.$id) {
    throw new Error(
      "Unauthorize, only workspace admin can perform this operation."
    );
  }

  //if so, admin becomes member , member becomes, admin
  const membersRepository = getInjection("IMembersRepository");

  //update member role to admin role in request id,
  const memberCollectionDocumentToBePromotedToAdmin =
    await membersRepository.getWorkspaceMember(memberId, workspaceId);

  const memberCollectionDocumentUpdatedToAdmin = await membersRepository.update(
    memberCollectionDocumentToBePromotedToAdmin.$id,
    { role: MemberRole.ADMIN }
  );

  //update admin role to member role-in member collection
  const memberCollectionDocumentToBeDemotedToMember =
    await membersRepository.getWorkspaceMember(user.$id, workspaceId);

  const memberCollectionDocumentUpdatedToMember =
    await membersRepository.update(
      memberCollectionDocumentToBeDemotedToMember.$id,
      { role: MemberRole.MEMBER }
    );

  //update workspace collection user id
  const updatedWorkspaceCollectionDocument = await workspacesRepository.update(
    {
      userId: memberCollectionDocumentUpdatedToAdmin.userId,
    },
    workspaceId
  );

  return {
    promoterId: memberCollectionDocumentUpdatedToAdmin.userId,
    demoterId: memberCollectionDocumentUpdatedToMember.userId,
  };
};
