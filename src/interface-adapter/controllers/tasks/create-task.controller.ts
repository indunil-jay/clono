import { createTaskUseCase } from "@/src/application/use-cases/tasks/create-task.use-case";
import {
  createTaskFormSchema,
  CreateTaskFromInput,
} from "@/src/interface-adapter/validation-schemas/task";

export const createTaskController = async (input: CreateTaskFromInput) => {
  const { data, error } = createTaskFormSchema.safeParse(input);
  if (error) {
    throw new Error("Task schema validation Error");
  }
  return await createTaskUseCase(data);
};
