import { Hono } from "hono";
import { handle } from "hono/vercel";
import auth from "@/src/routes/auth.routes";
import workspace from "@/src/routes/workspaces.routes";
import workspaces from "@/app/_features/workspace/route";
import members from "@/app/_features/members/route";
import projects from "@/app/_features/projects/route";

/* eslint-disable @typescript-eslint/no-unused-vars */

// export const runtime = "edge";

const app = new Hono().basePath("/api");

const routes = app
  .route("/auth", auth)
  .route("/workspaces", workspaces)
  .route("/workspaces", workspace)
  .route("/members", members)
  .route("/projects", projects);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
