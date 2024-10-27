import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchemaForm } from "./schema";
import { sessionMiddleware } from "@/src/lib/appwrite/session-middleware";
import { DATABASE_ID, WORKSPACE_COLLECTION_ID } from "@/src/lib/constants";
import { ID } from "node-appwrite";

const app = new Hono().post(
  "/",
  zValidator("json", createWorkspaceSchemaForm),
  sessionMiddleware,
  async (ctx) => {
    const databases = ctx.get("databases");
    const user = ctx.get("user");

    const { name } = ctx.req.valid("json");

    //create doc
    const workspace = await databases.createDocument(
      DATABASE_ID,
      WORKSPACE_COLLECTION_ID,
      ID.unique(),
      {
        name,
        userId: user.$id,
      }
    );

    return ctx.json({ data: workspace });
  }
);

export default app;
