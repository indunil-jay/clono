import { getInjection } from "@/src/tools/DI/container";

export const getWorkspaceByIdUseCase = async (workspaceId: string) => {
  const workspacesRepository = getInjection("IWorkspacesRepository");
  return await workspacesRepository.getworkspaceById(workspaceId);
};
