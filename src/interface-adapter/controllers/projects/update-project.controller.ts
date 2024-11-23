import { upadateProjectUseCase } from "@/src/application/use-cases/projects/update-project.use-case";
import {
  updateProjectFormSchema,
  UpdateProjectFromInput,
} from "@/src/interface-adapter/validation-schemas/project";

export const updateProjectController = async (
  projectId: string,
  input: UpdateProjectFromInput
) => {
  const { error, data } = updateProjectFormSchema.safeParse(input);

  if (error) {
    throw new Error("Validation Error");
  }

  return await upadateProjectUseCase(projectId, data);
};
