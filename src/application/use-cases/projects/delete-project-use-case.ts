import { getInjection } from "@/DI/container";
import { createSessionClient } from "@/src/lib/appwrite/appwrite";

export const deleteProjectUseCase = async (projectId: string) => {
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

  //if user is admin perform
  await projectsRepository.delete(projectId);
};
