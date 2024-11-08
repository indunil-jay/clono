import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchemaForm, updateWorkspaceSchemaForm } from "./schema";
import { sessionMiddleware } from "@/src/lib/appwrite/session-middleware";
import {
  DATABASE_ID,
  IMAGE_BUCKET_ID,
  WORKSPACE_COLLECTION_ID,
  MEMBERS_COLLECTION_ID,
} from "@/src/lib/constants";
import { ID, Query } from "node-appwrite";
import { MemberRole } from "../members/types";
import { generateInviteCode } from "./utils";
import { getMember } from "../members/utils";
import { z } from "zod";
import { Workspace } from "./types";

const app = new Hono()
  // .get("/", sessionMiddleware, async (ctx) => {
  //   const user = ctx.get("user");
  //   const databases = ctx.get("databases");

  //   //all members, that current user part of
  //   const members = await databases.listDocuments(
  //     DATABASE_ID,
  //     MEMBERS_COLLECTION_ID,
  //     [Query.equal("userId", user.$id)]
  //   );

  //   //return back if the login user not part of a worksace
  //   if (members.total === 0) {
  //     return ctx.json({ data: { documents: [], total: 0 } });
  //   }

  //   const workspaceIds = members.documents.map((member) => member.workspaceId);

  //   const workspaces = await databases.listDocuments(
  //     DATABASE_ID,
  //     WORKSPACE_COLLECTION_ID,
  //     [Query.contains("$id", workspaceIds), Query.orderDesc("$createdAt")]
  //   );

  //   return ctx.json({ data: workspaces });
  // })

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
          inviteCode: generateInviteCode(10),
        }
      );

      //add user to member db
      await databases.createDocument(
        DATABASE_ID,
        MEMBERS_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          workspaceId: workspace.$id,
          role: MemberRole.ADMIN,
        }
      );

      return ctx.json({ data: workspace });
    }
  )
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", updateWorkspaceSchemaForm),
    async (ctx) => {
      //
      const databases = ctx.get("databases");
      const user = ctx.get("user");
      const storage = ctx.get("storage");

      // get workspaceId from param
      const { workspaceId } = ctx.req.param();

      //get validated form data
      const { name, image } = ctx.req.valid("form");

      //check user allow to do action
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        return ctx.json({ error: "Unauthorize" }, 401);
      }

      //submitting process
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
      } else {
        uploadedImageUrl = image;
      }

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACE_COLLECTION_ID,
        workspaceId,
        { name, imageUrl: uploadedImageUrl }
      );

      return ctx.json({ data: workspace });
    }
  )
  .delete("/:workspaceId", sessionMiddleware, async (ctx) => {
    const databases = ctx.get("databases");
    const user = ctx.get("user");
    const storage = ctx.get("storage");
    const { workspaceId } = ctx.req.param();
    //check user allow to do action
    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return ctx.json({ error: "Unauthorize" }, 401);
    }

    //TODO:, delete memeber, project datas , task ,image which save in bucket

    await databases.deleteDocument(
      DATABASE_ID,
      WORKSPACE_COLLECTION_ID,
      workspaceId
    );
    return ctx.json({ data: { $id: workspaceId } });
  })
  .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (ctx) => {
    const databases = ctx.get("databases");
    const user = ctx.get("user");
    const storage = ctx.get("storage");
    const { workspaceId } = ctx.req.param();
    //check user allow to do action
    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return ctx.json({ error: "Unauthorize" }, 401);
    }

    const workspace = await databases.updateDocument(
      DATABASE_ID,
      WORKSPACE_COLLECTION_ID,
      workspaceId,
      {
        inviteCode: generateInviteCode(10),
      }
    );

    return ctx.json({ data: workspace });
  })
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", z.object({ code: z.string() })),
    async (ctx) => {
      const { workspaceId } = ctx.req.param();
      const { code } = ctx.req.valid("json");

      const databases = ctx.get("databases");
      const user = ctx.get("user");

      //check user allow to do action
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (member) {
        return ctx.json({ error: "Already a member" }, 500);
      }

      const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACE_COLLECTION_ID,
        workspaceId
      );

      if (workspace.inviteCode !== code) {
        return ctx.json({ error: "Invalid invite coode" }, 400);
      }

      await databases.createDocument(
        DATABASE_ID,
        MEMBERS_COLLECTION_ID,
        ID.unique(),
        { workspaceId, userId: user.$id, role: MemberRole.MEMBER }
      );

      return ctx.json({ data: workspace });
    }
  );

export default app;
