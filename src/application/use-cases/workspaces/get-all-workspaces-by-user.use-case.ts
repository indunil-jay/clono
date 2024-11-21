import { getInjection } from "@/DI/container";
import { createSessionClient } from "@/src/lib/appwrite/appwrite";

export const getAllWorkspacesWithCurrentUserUseCase = async () => {
  //get all current user part of workspaces
  const { account } = await createSessionClient();
  const user = await account.get();

  const workspacesRepository = getInjection("IWorkspacesRepository");
  const workspaces = await workspacesRepository.getAllByUser(user.$id);

  return workspaces;
};
