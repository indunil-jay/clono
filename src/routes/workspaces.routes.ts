import { Hono } from "hono";
import { sessionMiddleware } from "@/src/lib/appwrite/session-middleware";
import { getAllWorkspacesController } from "../interface-adapter/controllers/workspaces/get-all-workspaces.controller";

const app = new Hono().get("/", sessionMiddleware, async (ctx) => {
  const workspaces = await getAllWorkspacesController(ctx);
  console.log("routes", workspaces);
  return ctx.json({ data: workspaces });
});

export default app;
