import { Hono } from "hono";
import { handle } from "hono/vercel";
import auth from "@/src/interface-adapter/_routes/auth.routes";
import workspaces from "@/src/interface-adapter/_routes/workspace.routes";
import members from "@/src/interface-adapter/_routes/member.routes";
import tasks from "@/src/interface-adapter/_routes/task.routes";
import projects from "@/src/interface-adapter/_routes/project.routes";

/* eslint-disable @typescript-eslint/no-unused-vars */

// export const runtime = "edge";

const app = new Hono().basePath("/api");

const routes = app
  .route("/auth", auth)
  .route("/workspaces", workspaces)
  .route("/tasks", tasks)
  .route("/members", members)
  .route("/projects", projects);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
