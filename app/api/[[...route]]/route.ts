import { Hono } from "hono";
import { handle } from "hono/vercel";
import auth from "@/app/api/_routes/auth.routes";
import workspaces from "@/app/api/_routes/workspace.routes";

import members from "@/app/_features/members/route";
import projects from "@/app/_features/projects/route";
import tasks from "@/app/_features/tasks/route";

/* eslint-disable @typescript-eslint/no-unused-vars */

// export const runtime = "edge";

const app = new Hono().basePath("/api");

const routes = app
  .route("/auth", auth)
  .route("/workspaces", workspaces)

  .route("/members", members)
  .route("/projects", projects)
  .route("/tasks", tasks);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
