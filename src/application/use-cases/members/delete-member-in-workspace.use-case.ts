import { getInjection } from "@/src/tools/DI/container";
import { createSessionClient } from "@/src/tools/lib/appwrite/appwrite";

export const deleteMemberInWorkspaceUseCase = async (
  memberId: string,
  workspaceId: string
) => {
  //action can be done only for admin, check
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

  //if admin
  //get member collection document, which going to be delete
  const membersRepository = getInjection("IMembersRepository");

  const memberCollectionDocument = await membersRepository.getWorkspaceMember(
    memberId,
    workspaceId
  );

  if (!memberCollectionDocument) {
    throw new Error(
      "there is no memeber document with that userId and workspaceId"
    );
  }

  //delete
  await membersRepository.deleteWorkspaceMember(memberCollectionDocument.$id);
};
