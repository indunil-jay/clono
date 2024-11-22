import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { sessionMiddleware } from "@/src/lib/appwrite/session-middleware";
import { createAdminClient } from "@/src/lib/appwrite/appwrite";
import { DATABASE_ID, MEMBERS_COLLECTION_ID } from "@/src/lib/constants";
import { Query } from "node-appwrite";
import { Member } from "@/app/_features/members/types";
import { getMember } from "@/app/_features/members/utils";
import { MemberRole } from "@/src/entities/member.enum";
import { getAllMembersController } from "@/src/interface-adapter/controllers/members/get-all-members-in-workspace.controller";

const app = new Hono()
  .get("/:workspaceId", sessionMiddleware, async (ctx) => {
    const { workspaceId } = ctx.req.param();

    try {
      const members = await getAllMembersController(workspaceId);
      return ctx.json({ status: "success", data: members }, 200);
    } catch (error) {
      return ctx.json({ status: "fail" }, 400);
    }
  })

  .delete("/:memberId", sessionMiddleware, async (ctx) => {
    const { memberId } = ctx.req.param();
    const user = ctx.get("user");
    const databases = ctx.get("databases");

    const memeberToDelete = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_COLLECTION_ID,
      memberId
    );

    const allMembersInDatabase = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_COLLECTION_ID,
      [Query.equal("workspaceId", memeberToDelete.workspaceId)]
    );

    const memeber = await getMember({
      databases,
      workspaceId: memeberToDelete.workspaceId,
      userId: user.$id,
    });

    if (!memeber) {
      return ctx.json({ error: "unauthorized" }, 401);
    }

    if (
      memeber.$id !== memeberToDelete.$id &&
      memeber.role !== MemberRole.ADMIN
    ) {
      return ctx.json({ error: "unauthorized" }, 401);
    }

    if (allMembersInDatabase.total === 1) {
      return ctx.json({ error: "Can not delete only memeber" }, 400);
    }

    await databases.deleteDocument(
      DATABASE_ID,
      MEMBERS_COLLECTION_ID,
      memberId
    );
    return ctx.json({ data: { $id: memeberToDelete.$id } });
  })
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator("json", z.object({ role: z.nativeEnum(MemberRole) })),
    async (ctx) => {
      const user = ctx.get("user");
      const databases = ctx.get("databases");
      const { memberId } = ctx.req.param();
      const { role } = ctx.req.valid("json");

      const memeberToUpdate = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_COLLECTION_ID,
        memberId
      );

      const allMembersInDatabase = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_COLLECTION_ID,
        [Query.equal("workspaceId", memeberToUpdate.workspaceId)]
      );

      const memeber = await getMember({
        databases,
        workspaceId: memeberToUpdate.workspaceId,
        userId: user.$id,
      });

      if (!memeber) {
        return ctx.json({ error: "unauthorized" }, 401);
      }

      if (
        memeber.$id !== memeberToUpdate.$id &&
        memeber.role !== MemberRole.ADMIN
      ) {
        return ctx.json({ error: "unauthorized" }, 401);
      }

      if (allMembersInDatabase.total === 1) {
        return ctx.json({ error: "Can not delete only memeber" }, 400);
      }

      await databases.updateDocument(
        DATABASE_ID,
        MEMBERS_COLLECTION_ID,
        memberId,
        { role }
      );
      return ctx.json({ data: { $id: memeberToUpdate.$id } });
    }
  );

export default app;
