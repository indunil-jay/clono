import { getInjection } from "@/src/tools/DI/container";
import { TasksQuery } from "@/src/entities/task.entity";
import {
  createAdminClient,
  createSessionClient,
} from "@/src/tools/lib/appwrite/appwrite";

export const getAllTasksByWorkspaceIdControllerUseCase = async (
  query: TasksQuery
) => {
  //check memeber inside the workspace
  const { account } = await createSessionClient();
  const user = await account.get();

  const memebersRepository = getInjection("IMembersRepository");
  const membersCollectionDocument = await memebersRepository.getWorkspaceMember(
    user.$id,
    query.workspaceId
  );

  if (!membersCollectionDocument) {
    throw new Error("Unauthorize, you are not in the workspace");
  }

  //get task documents
  const tasksRepository = getInjection("ITasksRepository");
  const tasksCollectionDocumentList = await tasksRepository.getWorkspaceTasks(
    query.workspaceId,
    { query }
  );

  // console.log(tasksCollectionDocumentList);

  if (!(tasksCollectionDocumentList.documents.length > 0)) {
    //not a error this case
    return;
  }

  //if there is a document , then below are exists

  //selects projects details
  const projectIds = tasksCollectionDocumentList.documents.map(
    (document) => document.projectId
  );

  const projectsRepository = getInjection("IProjectRepository");

  const selectedProjectsCollectionDocumentList =
    await projectsRepository.getAllByIds(projectIds);

  // console.log({ selectedProjectsCollectionDocumentList });

  //populate users details
  const assigneeIds = tasksCollectionDocumentList.documents.map(
    (document) => document.assigneeId
  );

  const selectedMembersCollectionDocumentList =
    await memebersRepository.getAllMembersByIds(assigneeIds);

  // console.log({ selectedMembersCollectionDocumentList });

  const { users } = await createAdminClient();

  const populatedAssigneesDocumentList = await Promise.all(
    selectedMembersCollectionDocumentList.documents.map(async (document) => {
      const user = await users.get(document.userId);

      return {
        ...document,
        userId: document.userId,
        name: user.name,
        email: user.email,
      };
    })
  );

  //populated task documents
  const populatedTasksDocumentsList = tasksCollectionDocumentList.documents.map(
    (task) => {
      const project = selectedProjectsCollectionDocumentList.documents.find(
        (project) => project.$id === task.projectId
      )!;

      const assignee = populatedAssigneesDocumentList.find(
        (assignee) => assignee.userId === task.assigneeId
      )!;

      return {
        ...task,
        project,
        assignee,
      };
    }
  );

  return populatedTasksDocumentsList;
};
