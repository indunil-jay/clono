import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { sessionMiddleware } from "@/src/tools/lib/appwrite/session-middleware";
import {
  signInFormSchema,
  signUpFormSchema,
} from "@/src/interface-adapter/validation-schemas/auth";
import { signInWithCredentialsController } from "@/src/interface-adapter/controllers/auth/sign-in-with-credential.controller";
import { signUpController } from "@/src/interface-adapter/controllers/auth/sign-up.controller";
import { signOutController } from "@/src/interface-adapter/controllers/auth/sign-out.controller";
import { Exception } from "@/src/entities/errors/common-errors";

const app = new Hono()
  .post("/sign-up", zValidator("json", signUpFormSchema), async (ctx) => {
    const requestBodyJSON = ctx.req.valid("json");
    try {
      await signUpController(requestBodyJSON);
      return ctx.json({ message: "Registration successfull" }, 200);
    } catch (e) {
      const error = e as Exception;
      return ctx.json({ message: error.message }, error.code);
    }
  })
  .post("/sign-in", zValidator("json", signInFormSchema), async (ctx) => {
    const requestBodyJSON = ctx.req.valid("json");
    try {
      await signInWithCredentialsController(requestBodyJSON, ctx);
      return ctx.json({ message: "Login successful" }, 200);
    } catch (e) {
      const error = e as Exception;
      return ctx.json({ message: error.message }, error.code);
    }
  })

  .post(
    "/sign-out",
    zValidator("json", z.object({})),
    sessionMiddleware,
    async (ctx) => {
      try {
        await signOutController(ctx);
        return ctx.json({ message: "sign out successfully" }, 200);
      } catch (e) {
        const error = e as Exception;
        return ctx.json({ message: error.message }, error.code);
      }
    }
  )
  .get("/current", sessionMiddleware, (c) => {
    const user = c.get("user");
    return c.json({ data: user }, 200);
  });

export default app;
