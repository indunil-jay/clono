import { getInjection } from "@/src/tools/DI/container";
import { createSessionClient } from "@/src/tools/lib/appwrite/appwrite";

export const getProjectUseCase = async (projectId: string) => {
  //chek if there existing project
  const projectsRepository = getInjection("IProjectRepository");
  const projectsCollectionDocument = await projectsRepository.getById(
    projectId
  );

  if (!projectsCollectionDocument) {
    throw new Error("Bad Request, there is no documents with that ID");
  }

  const { account } = await createSessionClient();
  const user = await account.get();

  const memberRepository = getInjection("IMembersRepository");
  const memberCollectionDocument = await memberRepository.getWorkspaceMember(
    user.$id,
    projectsCollectionDocument.workspaceId
  );

  if (!memberCollectionDocument) {
    throw new Error("Unauthorize, you are not part of this workspace");
  }

  return projectsCollectionDocument;
};
