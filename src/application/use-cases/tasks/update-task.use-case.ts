import { UpdateTaskFromInput } from "@/src/entities/task.entity";
import { ReviewStatus, TaskStatus } from "@/src/entities/task.enums";
import { getInjection } from "@/src/tools/DI/container";
import { createSessionClient } from "@/src/tools/lib/appwrite/appwrite";

export const updateTaskUseCase = async (
  taskId: string,
  data: UpdateTaskFromInput
) => {
  // Check if there is an existing task
  const tasksRepository = getInjection("ITasksRepository");
  const tasksCollectionDocument = await tasksRepository.getById(taskId);

  if (!tasksCollectionDocument) {
    throw new Error("Bad request: invalid task ID");
  }

  // Get current user
  const { account } = await createSessionClient();
  const user = await account.get();

  // Get admin info
  const workspacesRepository = getInjection("IWorkspacesRepository");
  const workspacesCollectionDocument =
    await workspacesRepository.getworkspaceById(
      tasksCollectionDocument.workspaceId
    );

  const isAssignee = tasksCollectionDocument.assigneeId === user.$id;
  const isAdmin = workspacesCollectionDocument.userId === user.$id;

  // Unauthorized check
  if (!isAssignee && !isAdmin) {
    throw new Error(
      "Unauthorized: You have no permission to perform this action"
    );
  }

  let taskUpdates: Partial<typeof tasksCollectionDocument> = {};

  // Assignee's actions
  if (isAssignee) {
    if (data.assigneeComment) {
      taskUpdates.assigneeComment = data.assigneeComment;
      taskUpdates.status = TaskStatus.IN_REVIEW;
    }

    if (data.status) {
      taskUpdates.status = TaskStatus.IN_PROGRESS;
    }
  }

  // Admin's actions
  if (isAdmin) {
    if (data.status) {
      taskUpdates.status = data.status;
    }

    if (data.reviewerComment) {
      taskUpdates.reviewerId = workspacesCollectionDocument.userId;
      taskUpdates.reviewerComment = data.reviewerComment;
    }

    if (data.reviewStatus === ReviewStatus.ACCEPT) {
      taskUpdates.status = TaskStatus.DONE;
      taskUpdates.reviewStatus = ReviewStatus.ACCEPT;
    }

    if (data.reviewStatus === ReviewStatus.DECLINE) {
      taskUpdates.status = TaskStatus.TODO;
      taskUpdates.reviewStatus = ReviewStatus.DECLINE;
    }

    if (data.description) {
      taskUpdates.description = data.description;
    }

    if (data.assigneeId) {
      taskUpdates.assigneeId = data.assigneeId;
    }

    if (data.name) {
      taskUpdates.name = data.name;
    }

    if (data.dueDate) {
      taskUpdates.dueDate = data.dueDate;
    }
  }

  // Update the task
  const updatedTask = await tasksRepository.update(taskId, taskUpdates);
  return updatedTask;
};
