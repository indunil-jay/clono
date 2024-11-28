import { getInjection } from "@/src/tools/DI/container";
import { TaskStatus } from "@/src/entities/task.enums";
import { createSessionClient } from "@/src/tools/lib/appwrite/appwrite";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";

export const getWorkspaceAnalyticsByIdUseCase = async (workspaceId: string) => {
  //check the user access
  const { account } = await createSessionClient();
  const user = await account.get();

  const memebersRepository = getInjection("IMembersRepository");
  const memberCollectionDocument = await memebersRepository.getWorkspaceMember(
    user.$id,
    workspaceId
  );

  if (!memberCollectionDocument) {
    throw new Error("Unauthorized");
  }

  //calculate ananlytics
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const tasksRepository = getInjection("ITasksRepository");
  const taskCollectionDocumentList = await tasksRepository.getWorkspaceTasks(
    workspaceId
  );
  const totalTasks = taskCollectionDocumentList.total ?? 0;

  const thisMonthTasks =
    taskCollectionDocumentList.documents.filter((document) => {
      const createdAt = new Date(document.$createdAt);
      return createdAt >= thisMonthStart && createdAt <= thisMonthEnd;
    }).length ?? 0;
  const lastMonthTasks =
    taskCollectionDocumentList.documents.filter((document) => {
      const createdAt = new Date(document.$createdAt);
      return createdAt >= lastMonthStart && createdAt <= lastMonthEnd;
    }).length ?? 0;

  const tasksDifference = thisMonthTasks - lastMonthTasks;

  //completed tasks
  const completedTotalTasks =
    taskCollectionDocumentList.documents.filter(
      (document) => document.status === TaskStatus.DONE
    ).length ?? 0;

  const thisMonthCompletedTotalTasks =
    taskCollectionDocumentList.documents.filter((document) => {
      const createdAt = new Date(document.$createdAt);
      return (
        createdAt >= thisMonthStart &&
        createdAt <= thisMonthEnd &&
        document.status === TaskStatus.DONE
      );
    }).length ?? 0;

  const lastMonthCompletedTotalTasks =
    taskCollectionDocumentList.documents.filter((document) => {
      const createdAt = new Date(document.$createdAt);
      return (
        createdAt >= lastMonthStart &&
        createdAt <= lastMonthEnd &&
        document.status === TaskStatus.DONE
      );
    }).length ?? 0;

  const completedTasksDifference =
    thisMonthCompletedTotalTasks - lastMonthCompletedTotalTasks;

  //incompleted tasks
  const inCompletedTotalTasks =
    taskCollectionDocumentList.documents.filter(
      (document) => document.status !== TaskStatus.DONE
    ).length ?? 0;

  const thisMonthInCompletedTotalTasks =
    taskCollectionDocumentList.documents.filter((document) => {
      const createdAt = new Date(document.$createdAt);
      return (
        createdAt >= thisMonthStart &&
        createdAt <= thisMonthEnd &&
        document.status !== TaskStatus.DONE
      );
    }).length ?? 0;

  const lastMonthInCompletedTotalTasks =
    taskCollectionDocumentList.documents.filter((document) => {
      const createdAt = new Date(document.$createdAt);
      return (
        createdAt >= lastMonthStart &&
        createdAt <= lastMonthEnd &&
        document.status !== TaskStatus.DONE
      );
    }).length ?? 0;

  const inCompletedTasksDifference =
    thisMonthInCompletedTotalTasks - lastMonthInCompletedTotalTasks;

  //over-due tasks

  const overDueTotalTasks =
    taskCollectionDocumentList.documents.filter(
      (document) =>
        document.status !== TaskStatus.DONE && document.dueDate > now
    ).length ?? 0;

  const thisMonthOverDueTotalTasks =
    taskCollectionDocumentList.documents.filter((document) => {
      const createdAt = new Date(document.$createdAt);
      return (
        createdAt >= thisMonthStart &&
        createdAt <= thisMonthEnd &&
        document.status !== TaskStatus.DONE &&
        document.dueDate > now
      );
    }).length ?? 0;

  const lastMonthOverDueTotalTasks =
    taskCollectionDocumentList.documents.filter((document) => {
      const createdAt = new Date(document.$createdAt);
      return (
        createdAt >= lastMonthStart &&
        createdAt <= lastMonthEnd &&
        document.status !== TaskStatus.DONE &&
        document.dueDate > now
      );
    }).length ?? 0;

  const overDueTasksDifference =
    thisMonthOverDueTotalTasks - lastMonthOverDueTotalTasks;

  const tasksAnalytics = {
    totalTasks,
    thisMonthTasks,
    lastMonthTasks,
    tasksDifference,

    completedTotalTasks,
    thisMonthCompletedTotalTasks,
    lastMonthCompletedTotalTasks,
    completedTasksDifference,

    inCompletedTotalTasks,
    thisMonthInCompletedTotalTasks,
    lastMonthInCompletedTotalTasks,
    inCompletedTasksDifference,

    overDueTotalTasks,
    thisMonthOverDueTotalTasks,
    lastMonthOverDueTotalTasks,
    overDueTasksDifference,
  };

  //backlog,todo,in-progress, in-review,done
};
