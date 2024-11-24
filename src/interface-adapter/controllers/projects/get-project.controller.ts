import { getProjectUseCase } from "@/src/application/use-cases/projects/get-project.use-case";

export const getProjectController = async (projectId: string) => {
  return await getProjectUseCase(projectId);
};
