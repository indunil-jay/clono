import { getAllTasksByWorkspaceIdControllerUseCase } from "@/src/application/use-cases/tasks/get-all-tasks-by-workspace-id.use-case";
import { TasksQuery } from "@/src/entities/task.entity";

export type CollectionDocumentListType = Awaited<
  ReturnType<typeof getAllTasksByWorkspaceIdControllerUseCase>
>;

const presenter = (collectionDocumentList: CollectionDocumentListType) => {
  return collectionDocumentList?.map((document) => {
    return {
      id: document.$id,
      name: document.name,
      project: {
        id: document.project.$id,
        name: document.project.name,
        imageUrl: document.project.imageUrl,
      },
      assignee: {
        id: document.assignee.$id,
        name: document.assignee.name,
        email: document.assignee.email,
      
      },
      dueDate: document.dueDate,
      status: document.status,
    };
  });
};
export type getAllTasksByWorkspacceIdControllerResponse = ReturnType<
  typeof presenter
>;

export const getAllTasksByWorkspacceIdController = async (
  query: TasksQuery
): Promise<getAllTasksByWorkspacceIdControllerResponse> => {
  const tasksCollectionDocumentList =
    await getAllTasksByWorkspaceIdControllerUseCase(query);

  return presenter(tasksCollectionDocumentList);
};
