import { getInjection } from "@/src/tools/DI/container";
import { CreateTaskFromInput } from "@/src/interface-adapter/validation-schemas/task";
import { createSessionClient } from "@/src/tools/lib/appwrite/appwrite";
import { Query } from "node-appwrite";

export const createTaskUseCase = async (data: CreateTaskFromInput) => {
  //task can be only created admin of workspace
  //check if user is workspace admin
  const { account } = await createSessionClient();
  const user = await account.get();

  const workspacesRepository = getInjection("IWorkspacesRepository");
  const workspacesCollectionDocument =
    await workspacesRepository.getworkspaceById(data.workspaceId);

  //if current user not a admin
  if (user.$id !== workspacesCollectionDocument.userId) {
    throw new Error("Unauthorize, this action can perfom only admin");
  }

  //if admin,

  //chekck highest position of current type task based on status and workspaceId.
  const tasksRepository = getInjection("ITasksRepository");
  const tasksCollectionDocumentList = await tasksRepository.getWorkspaceTasks(
    data.workspaceId,
    {
      query: {
        status: data.status,
      },
      limit: 1,
      orderAsc: "position",
    }
  );

  [
    Query.equal("status", data.status),
    Query.equal("workspaceId", data.workspaceId),
    Query.orderAsc("position"),
    Query.limit(1),
  ];

  const calculateNewPositionOfNewDocument =
    tasksCollectionDocumentList.documents.length > 0
      ? tasksCollectionDocumentList.documents[0].position + 1000
      : 1000;

  //create new document
  return await tasksRepository.create({
    ...data,
    position: calculateNewPositionOfNewDocument,
  });
};
