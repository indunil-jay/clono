import { getInjection } from "@/src/tools/DI/container";
import { createSessionClient } from "@/src/tools/lib/appwrite/appwrite";

export const getAllProjectsByWorkspaceIdUseCase = async (
  workspaceId: string
) => {
  const { account } = await createSessionClient();
  const user = await account.get();

  //check if there atleast on document, beacuse block viewing projects by unauthorize users
  //only projects can be view only workspace user
  const memberRepository = getInjection("IMembersRepository");
  const memberCollectionDocument = await memberRepository.getWorkspaceMember(
    user.$id,
    workspaceId
  );

  if (!memberCollectionDocument) {
    throw new Error(
      "Unauthorize.To view projects you need to part of workspace."
    );
  }

  //if there is any return  all the projects that workspace belongs
  const projectsRepository = getInjection("IProjectRepository");
  const projectsCollectionDocumentList =
    await projectsRepository.getAllByWorkspaceId(workspaceId);

  return projectsCollectionDocumentList;
};
