import { updateTaskUseCase } from "@/src/application/use-cases/tasks/update-task.use-case";
import {
  updateTaskExtendedFormSchema,
  UpdateTaskFromInput,
} from "@/src/entities/task.entity";

export const updateTaskController = async (
  taskId: string,
  input: UpdateTaskFromInput
) => {
  const { data, error } = updateTaskExtendedFormSchema.safeParse(input);
  if (error) {
    console.log(error);
    throw new Error("update task validation Error");
  }

  return await updateTaskUseCase(taskId, data);
};
