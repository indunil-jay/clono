import { getAllWorkspacesUseCase } from "@/src/application/use-cases/workspaces/get-workspaces.use-case";
import { Context } from "hono";

export const getAllWorkspacesController = async (ctx: Context) => {
  return await getAllWorkspacesUseCase(ctx);
};
