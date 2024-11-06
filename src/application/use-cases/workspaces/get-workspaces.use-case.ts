import { getInjection } from "@/DI/container";
import { Context } from "hono";

export const getAllWorkspacesUseCase = async (ctx: Context) => {
  const workspacesRepository = getInjection("IWorkspacesRepository");
  return await workspacesRepository.getAll(ctx);
};
