import { getInjection } from "@/src/tools/DI/container";
import { createSessionClient } from "@/src/tools/lib/appwrite/appwrite";

export const deleteTaskUseCase = async (taskId: string) => {
  //check if there existing task with that Id
  const tasksRepository = getInjection("ITasksRepository");
  const tasksCollectionDocument = await tasksRepository.getById(taskId);

  if (!tasksCollectionDocument) {
    throw new Error("Bad Request, there is no document with that Id.");
  }

  //task can be only delete  admin of workspace
  //check if user is workspace admin
  const { account } = await createSessionClient();
  const user = await account.get();

  const workspacesRepository = getInjection("IWorkspacesRepository");
  const workspacesCollectionDocument =
    await workspacesRepository.getworkspaceById(
      tasksCollectionDocument.workspaceId
    );

  //if current user not a admin
  if (user.$id !== workspacesCollectionDocument.userId) {
    throw new Error("Unauthorize, this action can perfom only admin");
  }

  //delete
  await tasksRepository.delete(tasksCollectionDocument.$id);
};
