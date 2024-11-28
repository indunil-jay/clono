import { getInjection } from "@/src/tools/DI/container";
import {
  createAdminClient,
  createSessionClient,
} from "@/src/tools/lib/appwrite/appwrite";

export const getTaskUseCase = async (taskId: string) => {
  const tasksRepository = getInjection("ITasksRepository");
  const tasksCollectionDocument = await tasksRepository.getById(taskId);

  if (!tasksCollectionDocument) {
    throw new Error("Bad request there is no task with that id.");
  }

  //check  member is inside the workspace
  //for that we need to check there is any document inside the member collection

  const { account } = await createSessionClient();
  const user = await account.get();

  const memberRepository = getInjection("IMembersRepository");
  const memberCollectionDocument = await memberRepository.getWorkspaceMember(
    user.$id,
    tasksCollectionDocument.workspaceId
  );

  if (!memberCollectionDocument) {
    throw new Error("Unauthorize, you are not in this workspace.");
  }

  //add projects data
  const projectsRepository = getInjection("IProjectRepository");
  const projectsCollectionDocument = await projectsRepository.getById(
    tasksCollectionDocument.projectId
  );

  //get asignnee details
  const { users } = await createAdminClient();
  const assigneeDocuments = await users.get(tasksCollectionDocument.assigneeId);

  return {
   usersCollectionDocument:{
    name: assigneeDocuments.name,
    email: assigneeDocuments.email,
   },
    projectsCollectionDocument,
    tasksCollectionDocument,
  };
};
