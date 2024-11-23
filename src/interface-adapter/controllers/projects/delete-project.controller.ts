import { deleteProjectUseCase } from "@/src/application/use-cases/projects/delete-project-use-case";

export const deleteProjectController = async (projectId: string) => {
  await deleteProjectUseCase(projectId);
};
