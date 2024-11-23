import { createProjectUseCase } from "@/src/application/use-cases/projects/create-project.use-case";
import {
  createProjectFormSchema,
  CreateProjectFromInput,
} from "@/src/interface-adapter/validation-schemas/project";

export const createProjectController = async (
  input: CreateProjectFromInput
) => {
  const { data, error } = createProjectFormSchema.safeParse(input);
  if (error) {
    throw new Error("Validation error");
  }

  const projectCollectionDocument = await createProjectUseCase(data);

  return projectCollectionDocument;
};
