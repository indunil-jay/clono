import { getAllWorkspacesAnallticsUseCase } from "@/src/application/use-cases/workspaces/get-all-workspaces-analytics.use-case";

export const getAllWorkspacesAnallticsController = async () => {
  return await getAllWorkspacesAnallticsUseCase();
};
