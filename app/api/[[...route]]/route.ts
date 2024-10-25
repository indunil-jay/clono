import { Hono } from "hono";
import { handle } from "hono/vercel";
import auth from "@/src/routes/auth.routes";

/* eslint-disable @typescript-eslint/no-unused-vars */

// export const runtime = "edge";

const app = new Hono().basePath("/api");

const routes = app.route("/auth", auth);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
