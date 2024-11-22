import { getInjection } from "@/DI/container";
import {
  createAdminClient,
  createSessionClient,
} from "@/src/lib/appwrite/appwrite";

export const getAllMembersInWorkspaceUseCase = async (workspaceId: string) => {
  //check member has access to see list
  const { account } = await createSessionClient();
  const user = await account.get();

  const membersRepository = getInjection("IMembersRepository");
  const membersCollectionDocument = await membersRepository.getWorkspaceMember(
    user.$id,
    workspaceId
  );

  if (!membersCollectionDocument) {
    throw new Error("Unauthorized.");
  }

  //get all members, that matches to workspaceId
  const membersCollectionDocumentList =
    await membersRepository.getAllMembersInWorkspace(workspaceId);

  //populated user details such as name, email
  const { users } = await createAdminClient();
  const populatedMembers = await Promise.all(
    membersCollectionDocumentList.documents.map(async (document) => {
      const user = await users.get(document.userId);

      return { ...document, name: user.name, email: user.email };
    })
  );

  return populatedMembers;
};
