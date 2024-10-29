import { AUTH_COOKIE } from "@/src/lib/constants";
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
  async (c, next) => {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = await getCookie(c, AUTH_COOKIE);

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    client.setSession(session);

    const account = new Account(client);
    const database = new Databases(client);
    const storage = new Storage(client);

    const user = await account.get();

    c.set("account", account);
    c.set("databases", database);
    c.set("storage", storage);
    c.set("user", user);
    await next();
  }
);
