import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { deleteCookie } from "hono/cookie";

import { sessionMiddleware } from "@/src/lib/appwrite/session-middleware";
import { AUTH_COOKIE } from "@/src/lib/constants";
import {
  signInFormSchema,
  signUpFormSchema,
} from "@/src/interface-adapter/validation-schemas/auth";
import { signInWithCredentialsController } from "@/src/interface-adapter/controllers/auth/sign-in-with-credential.controller";
import { signUpController } from "@/src/interface-adapter/controllers/auth/sign-up.controller";
import { signOutController } from "../interface-adapter/controllers/auth/sign-out.controller";

const app = new Hono()
  .post("/sign-in", zValidator("json", signInFormSchema), async (ctx) => {
    const requestBodyJSON = ctx.req.valid("json");
    await signInWithCredentialsController(requestBodyJSON, ctx);
    return ctx.json({ success: true });
  })
  .post("/sign-up", zValidator("json", signUpFormSchema), async (ctx) => {
    const requestBodyJSON = ctx.req.valid("json");
    await signUpController(requestBodyJSON, ctx);
    return ctx.json({ success: true });
  })
  .post("/sign-out", sessionMiddleware, async (ctx) => {
    await signOutController(ctx);
    return ctx.json({ success: true });
  })
  .get("/current", sessionMiddleware, (c) => {
    const user = c.get("user");
    return c.json({ data: user });
  });

export default app;
