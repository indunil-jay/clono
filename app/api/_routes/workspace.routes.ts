import { createWorkspaceController } from "./../../../src/interface-adapter/controllers/workspaces/create-workspace.controller";
import { Hono } from "hono";
import { z } from "zod";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { zValidator } from "@hono/zod-validator";
import { ID, Query } from "node-appwrite";

import { sessionMiddleware } from "@/src/lib/appwrite/session-middleware";
import {
  TASKS_COLLECTION_ID,
  DATABASE_ID,
  IMAGE_BUCKET_ID,
  WORKSPACE_COLLECTION_ID,
  MEMBERS_COLLECTION_ID,
} from "@/src/lib/constants";
import { Workspace } from "@/app/_features/workspace/types";
import {
  createWorkspaceSchemaForm,
  updateWorkspaceSchemaForm,
} from "@/app/_features/workspace/schema";
// import { generateInviteCode } from "@/app/_features/workspace/utils";
import { MemberRole } from "@/app/_features/members/types";
import { getMember } from "@/app/_features/members/utils";
import { TaskStatus } from "@/app/_features/tasks/types";
import { generateInviteCode } from "@/src/lib/generate-invite-code";

const app = new Hono()
  .post(
    "/",
    zValidator("form", createWorkspaceSchemaForm),
    sessionMiddleware,
    async (ctx) => {
      const { name, image } = ctx.req.valid("form");
      try {
        const { workspaceId } = await createWorkspaceController({
          name,
          image,
        });
        return ctx.json({ status: true, data: { workspaceId } }, 200);
      } catch (error) {
        return ctx.json({ status: false, data: null }, 400);
      }
    }
  )
  .get("/", sessionMiddleware, async (ctx) => {
    const user = ctx.get("user");
    const databases = ctx.get("databases");

    //all members, that current user part of
    const members = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_COLLECTION_ID,
      [Query.equal("userId", user.$id)]
    );

    //return back if the login user not part of a worksace
    if (members.total === 0) {
      return ctx.json({ data: { documents: [], total: 0 } });
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACE_COLLECTION_ID,
      [Query.contains("$id", workspaceIds), Query.orderDesc("$createdAt")]
    );

    return ctx.json({ data: workspaces });
  })

  .get("/:workspaceId/info", sessionMiddleware, async (ctx) => {
    const user = ctx.get("user");
    const databases = ctx.get("databases");
    const { workspaceId } = ctx.req.param();

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACE_COLLECTION_ID,
      workspaceId
    );

    return ctx.json({
      data: {
        $id: workspace.$id,
        name: workspace.name,
        imageUrl: workspace.imageUrl,
      },
    });
  })

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
  )
  .get("/:workspaceId/analytics", sessionMiddleware, async (ctx) => {
    const user = ctx.get("user");
    const databases = ctx.get("databases");
    const { workspaceId } = ctx.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return ctx.json({ error: "Unauthorized" }, 401);
    }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      [
        Query.equal("workspaceId", workspaceId),

        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const taskCount = thisMonthTasks.total;
    const taskDifference = taskCount - lastMonthTasks.total;

    const thisMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      [
        Query.equal("workspaceId", workspaceId),

        Query.equal("assigneeId", member.$id),

        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      [
        Query.equal("workspaceId", workspaceId),

        Query.equal("assigneeId", member.$id),

        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const assignedTaskCount = thisMonthAssignedTasks.total;
    const assignedTaskDifference =
      assignedTaskCount - lastMonthAssignedTasks.total;

    const thisMonthInCompleteTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      [
        Query.equal("workspaceId", workspaceId),

        Query.notEqual("status", TaskStatus.DONE),

        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthInCompleteTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      [
        Query.equal("workspaceId", workspaceId),

        Query.notEqual("status", TaskStatus.DONE),

        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const incompleteTaskCount = thisMonthInCompleteTask.total;
    const incompleteTaskDifference =
      incompleteTaskCount - lastMonthInCompleteTask.total;

    const thisMonthCompletedTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      [
        Query.equal("workspaceId", workspaceId),

        Query.equal("status", TaskStatus.DONE),

        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthCompletedTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      [
        Query.equal("workspaceId", workspaceId),

        Query.equal("status", TaskStatus.DONE),

        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const completeTaskCount = thisMonthCompletedTask.total;
    const completeTaskDifference =
      completeTaskCount - lastMonthCompletedTask.total;

    const thisMonthOverdueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      [
        Query.equal("workspaceId", workspaceId),

        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),

        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthOverdueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      [
        Query.equal("workspaceId", workspaceId),

        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),

        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const overDueTaskCount = thisMonthOverdueTasks.total;
    const overDueTaskDifference =
      overDueTaskCount - lastMonthOverdueTasks.total;

    return ctx.json({
      data: {
        taskCount,
        taskDifference,
        assignedTaskCount,
        assignedTaskDifference,
        completeTaskCount,
        completeTaskDifference,
        incompleteTaskCount,
        incompleteTaskDifference,
        overDueTaskCount,
        overDueTaskDifference,
      },
    });
  });

export default app;
