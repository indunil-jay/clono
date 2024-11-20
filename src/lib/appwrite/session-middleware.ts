import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import {
  Account,
  Client,
  Databases,
  Storage,
  type Users as UsersType,
  type Account as AccountType,
  type Databases as DatabaseType,
  type Storage as StorageType,
  Models,
} from "node-appwrite";

import { AUTH_COOKIE } from "@/src/lib/constants";
import { createSessionClient } from "./appwrite";

type AdditionalContext = {
  Variables: {
    account: AccountType;
    databases: DatabaseType;
    storage: StorageType;
    users: UsersType;
    user: Models.User<Models.Preferences>;
  };
};

export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (ctx, next) => {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = getCookie(ctx, AUTH_COOKIE);

    if (!session) {
      return ctx.json({ success: false, error: "Unauthorized" }, 401);
    }

    client.setSession(session);

    const account = new Account(client);
    const databases = new Databases(client);
    const storage = new Storage(client);

    //get session user
    const user = await account.get();

    ctx.set("account", account);
    ctx.set("databases", databases);
    ctx.set("storage", storage);
    ctx.set("user", user);

    await next();
  }
);
