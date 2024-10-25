import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { deleteCookie, setCookie } from "hono/cookie";
import { SignInSchema } from "@/src/lib/schemas";
import { createAdminClient } from "@/src/lib/appwrite/appwrite";
import { sessionMiddleware } from "@/src/lib/appwrite/session-middleware";
import { AUTH_COOKIE } from "@/src/lib/constants";
import { signUpFormSchema } from "@/src/interface-adapter/validation-schemas/auth";
import { signUpController } from "@/src/interface-adapter/controllers/auth/sign-up.controller";

const app = new Hono()
  .post("/sign-up", zValidator("json", signUpFormSchema), async (ctx) => {
    const requestBodyJSON = ctx.req.valid("json");
    await signUpController(requestBodyJSON, ctx);
    return ctx.json({ success: true });
  })
  .get("/current", sessionMiddleware, (c) => {
    const user = c.get("user");
    return c.json({ data: user });
  })
  .get("/:id", sessionMiddleware, (c) => {
    const param = c.req.param("id");
    return c.json({ data: param });
  })
  .post(
    "/sign-in",
    zValidator("json", SignInSchema),

    async (c) => {
      const { email, password } = c.req.valid("json");

      const { account } = await createAdminClient();
      const session = await account.createEmailPasswordSession(email, password);
      setCookie(c, AUTH_COOKIE, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });

      return c.json({ success: true });
    }
  )

  .post("/logout", sessionMiddleware, async (c) => {
    const account = c.get("account");
    deleteCookie(c, AUTH_COOKIE);
    await account.deleteSession("current");
    return c.json({ success: true });
  });

// const app = new Hono();
// const factory = createFactory();

// // Define middleware (optional)
// const middleware = factory.createMiddleware(async (c, next) => {
//   await next();
// });

// // Define handlers
// const signUpHandlers = factory.createHandlers(
//   zValidator("json", signUpFormSchema),
//   middleware,
//   async (c) => {
//     const requestBodyJSON = c.req.valid("json");
//     await signUpController(requestBodyJSON, c);
//     return c.json({ success: true });
//   }
// );

// const currentUserHandlers = factory.createHandlers(middleware, async (c) => {
//   const user = c.get("user");
//   return c.json({ data: user });
// });

// const getUserByIdHandlers = factory.createHandlers(
//   sessionMiddleware,
//   async (c) => {
//     const param = c.req.param("id");
//     return c.json({ data: param });
//   }
// );

// const signInHandlers = factory.createHandlers(
//   zValidator("json", SignInSchema),
//   middleware,
//   async (c) => {
//     const { email, password } = c.req.valid("json");
//     const { account } = await createAdminClient();
//     const session = await account.createEmailPasswordSession(email, password);
//     setCookie(c, AUTH_COOKIE, session.secret, {
//       path: "/",
//       httpOnly: true,
//       secure: true,
//       sameSite: "strict",
//       maxAge: 60 * 60 * 24 * 30,
//     });
//     return c.json({ success: true });
//   }
// );

// const logoutHandlers = factory.createHandlers(sessionMiddleware, async (c) => {
//   const account = c.get("account");
//   deleteCookie(c, AUTH_COOKIE);
//   await account.deleteSession("current");
//   return c.json({ success: true });
// });

// // Define routes
// app.post("/sign-up", ...signUpHandlers);
// app.get("/current", ...currentUserHandlers);
// app.get("/:id", ...getUserByIdHandlers);
// app.post("/sign-in", ...signInHandlers);
// app.post("/logout", ...logoutHandlers);

export default app;
