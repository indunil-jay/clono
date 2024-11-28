import { getInjection } from "@/src/tools/DI/container";
import { createSessionClient } from "@/src/tools/lib/appwrite/appwrite";

export const getAllWorkspacesWithCurrentUserUseCase = async () => {
  //get all current user part of workspaces
  const { account } = await createSessionClient();
  const user = await account.get();

  //get all memebers documents which current user part of
  const memberRepository = getInjection("IMembersRepository");
  const membersDocumentList = await memberRepository.getAllByUser(user.$id);

  //extarct workspaces Ids
  const workspaceId = membersDocumentList.documents.map(
    (document) => document.workspaceId
  );

  //get all workspace  current user partof
  const workspacesRepository = getInjection("IWorkspacesRepository");
  const workspaces = await workspacesRepository.getWorkspacesByIds(workspaceId);

  return workspaces;
};
