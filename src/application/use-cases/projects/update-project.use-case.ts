import { getInjection } from "@/src/tools/DI/container";
import { UpdateProjectFromInput } from "@/src/interface-adapter/validation-schemas/project";
import { createSessionClient } from "@/src/tools/lib/appwrite/appwrite";

export const upadateProjectUseCase = async (
  projectId: string,
  input: UpdateProjectFromInput
) => {
  //check if there existing project with that id
  const projectsRepository = getInjection("IProjectRepository");
  const projectsCollectionDocument = await projectsRepository.getById(
    projectId
  );

  if (!projectsCollectionDocument) {
    throw new Error("Bad Request, there is no project with that ID.");
  }

  //check if user is workspace admin
  const { account } = await createSessionClient();
  const user = await account.get();

  const workspacesRepository = getInjection("IWorkspacesRepository");
  const workspacesCollectionDocument =
    await workspacesRepository.getworkspaceById(
      projectsCollectionDocument.workspaceId
    );
  //if there is project, it should has workspace, no need to error handle for no workspace.

  if (user.$id !== workspacesCollectionDocument.userId) {
    throw new Error("Unauthorize, this action can perfom only admin");
  }

  //update image,
  const storageService = getInjection("IStorageService");
  const uploadedImageUrl = await storageService.upload(input.image);

  //update project collection document
  return await projectsRepository.update(projectId, {
    name: input.name,
    imageUrl: uploadedImageUrl,
  });
};
