import { sessionMiddleware } from "@/src/lib/appwrite/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { getMember } from "../members/utils";
import {
  DATABASE_ID,
  IMAGE_BUCKET_ID,
  PROJECTS_COLLECTION_ID,
} from "@/src/lib/constants";
import { ID, Query } from "node-appwrite";
import { error } from "console";
import { createProjectSchemaForm } from "./schema";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (ctx) => {
      const user = ctx.get("user");
      const databases = ctx.get("databases");
      const { workspaceId } = ctx.req.valid("query");

      if (!workspaceId) {
        return ctx.json({ error: "Missing workspaceId" }, 400);
      }

      const memeber = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!memeber) {
        return ctx.json({ error: "Unauthorized" }, 401);
      }

      const projects = await databases.listDocuments(
        DATABASE_ID,
        PROJECTS_COLLECTION_ID,
        [Query.equal("workspaceId", workspaceId), Query.orderDesc("$createdAt")]
      );

      return ctx.json({ data: projects });
    }
  )
  .post(
    "/",
    zValidator("form", createProjectSchemaForm),
    sessionMiddleware,
    async (ctx) => {
      const databases = ctx.get("databases");
      const user = ctx.get("user");
      const storage = ctx.get("storage");

      const { name, image, workspaceId } = ctx.req.valid("form");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return ctx.json({ error: "Unauthorised" }, 400);
      }

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
      const project = await databases.createDocument(
        DATABASE_ID,
        PROJECTS_COLLECTION_ID,
        ID.unique(),

        {
          name,
          imageUrl: uploadedImageUrl,
          workspaceId,
        }
      );

      return ctx.json({ data: project });
    }
  );

export default app;
