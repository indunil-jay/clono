import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchemaForm } from "./schema";
import { sessionMiddleware } from "@/src/lib/appwrite/session-middleware";
import {
  DATABASE_ID,
  IMAGE_BUCKET_ID,
  WORKSPACE_COLLECTION_ID,
} from "@/src/lib/constants";
import { ID } from "node-appwrite";

const app = new Hono()
  .get("/", sessionMiddleware, async (ctx) => {
    const databases = ctx.get("databases");

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACE_COLLECTION_ID
    );

    return ctx.json({ data: workspaces });
  })

  .post(
    "/",
    zValidator("form", createWorkspaceSchemaForm),
    sessionMiddleware,
    async (ctx) => {
      const databases = ctx.get("databases");
      const user = ctx.get("user");
      const storage = ctx.get("storage");

      const { name, image } = ctx.req.valid("form");

      let uploadedImageUrl: string | undefined = undefined;

      //TODO:error handle
      //rollback  mechanism for database operation
      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGE_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGE_BUCKET_ID,
          file.$id
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }

      //create document
      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACE_COLLECTION_ID,
        ID.unique(),

        {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
        }
      );

      return ctx.json({ data: workspace });
    }
  );

export default app;
