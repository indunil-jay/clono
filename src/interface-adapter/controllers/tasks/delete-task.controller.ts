import { deleteTaskUseCase } from "@/src/application/use-cases/tasks/delete-task.use-case";

export const deleteTaskController = async (taskId: string) => {
  await deleteTaskUseCase(taskId);
};
