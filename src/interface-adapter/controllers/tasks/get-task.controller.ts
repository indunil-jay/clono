import { getTaskUseCase } from "@/src/application/use-cases/tasks/get-task.use-case";



export const getTaskController = async (taskId: string) => {
  return await getTaskUseCase(taskId)
};

