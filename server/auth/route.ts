import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { SignInSchema } from "../schemas";

const app = new Hono().post(
  "/sign-in",
  zValidator("json", SignInSchema),

  async (c) => {
    const { email, password } = c.req.valid("json");
    console.log({ email, password });
    return c.json({ success: "OK" });
  }
);

export default app;
