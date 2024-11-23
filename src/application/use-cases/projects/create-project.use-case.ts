import { getInjection } from "@/DI/container";
import { CreateProjectFromInput } from "@/src/interface-adapter/validation-schemas/project";
import { createSessionClient } from "@/src/lib/appwrite/appwrite";

export const createProjectUseCase = async (data: CreateProjectFromInput) => {
  //memeber and admin both can create workspae,before all that, need to inside a workspace
  //check user inside the requested workspaceId
  const { account } = await createSessionClient();
  const user = await account.get();

  const membersRepository = getInjection("IMembersRepository");
  const memberCollectionDocument = await membersRepository.getWorkspaceMember(
    user.$id,
    data.workspaceId
  );

  //if member not inside a workspace return;
  if (!memberCollectionDocument) {
    throw new Error(
      "Your are not in a workspace, please create or join a workspace."
    );
  }

  //upload image to the bucket
  const storageService = getInjection("IStorageService");
  const uploadedImageUrl = await storageService.upload(data.imageUrl);

  //create new project
  const projectsRepository = getInjection("IProjectRepository");
  const projectsCollectionDocument = await projectsRepository.create({
    name: data.name,
    workspaceId: data.workspaceId,
    imageUrl: uploadedImageUrl,
  });

  return projectsCollectionDocument;
};
