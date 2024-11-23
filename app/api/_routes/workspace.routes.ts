import { Hono } from "hono";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { zValidator } from "@hono/zod-validator";
import { Query } from "node-appwrite";

import { sessionMiddleware } from "@/src/lib/appwrite/session-middleware";
import {
  TASKS_COLLECTION_ID,
  DATABASE_ID,
  WORKSPACE_COLLECTION_ID,
} from "@/src/lib/constants";
import { getMember } from "@/app/_features/members/utils";
import { TaskStatus } from "@/app/_features/tasks/types";

import { getAllWorkspacesWithCurrentUserController } from "@/src/interface-adapter/controllers/workspaces/get-all-workspaces.controller";
import { updateWorkspaceController } from "@/src/interface-adapter/controllers/workspaces/update-workspace.controller";
import { deleteWorkspaceController } from "@/src/interface-adapter/controllers/workspaces/delete-workspace.controller";
import { joinMemberToWorkspaceController } from "@/src/interface-adapter/controllers/workspaces/join-member-to-workspace.controller";
import { getAllWorkspacesAnallticsController } from "@/src/interface-adapter/controllers/workspaces/get-all-workspaces-analytics.controller";
import { updateWorkspaceInviteCodeController } from "@/src/interface-adapter/controllers/workspaces/update-workspace-invite-code.controller";
import { createWorkspaceController } from "@/src/interface-adapter/controllers/workspaces/create-workspace.controller";
import {
  createWorkspaceFormSchema,
  updateWorkspaceFormSchema,
} from "@/src/interface-adapter/validation-schemas/workspace";
import { getWorkspaceInfoByIdController } from "@/src/interface-adapter/controllers/workspaces/get-workspace-info-by-id.controller";

const app = new Hono()
  .post(
    "/",
    zValidator("form", createWorkspaceFormSchema),
    sessionMiddleware,
    async (ctx) => {
      const { name, image } = ctx.req.valid("form");
      try {
        const { workspaceId } = await createWorkspaceController({
          name,
          image,
        });
        return ctx.json({ status: "success", data: { workspaceId } }, 200);
      } catch (error) {
        return ctx.json({ status: "fail", data: null }, 400);
      }
    }
  )
  .get("/", sessionMiddleware, async (ctx) => {
    try {
      const data = await getAllWorkspacesWithCurrentUserController();
      return ctx.json({ status: "success", data }, 200);
    } catch (error) {
      return ctx.json({ status: "fail", data: null }, 400);
    }
  })
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", updateWorkspaceFormSchema),
    async (ctx) => {
      const { workspaceId } = ctx.req.param();
      const { name, image } = ctx.req.valid("form");

      try {
        const data = await updateWorkspaceController(
          { name, image },
          workspaceId
        );
        return ctx.json(
          { status: "success", data: { workspaceId: data.workspaceId } },
          200
        );
      } catch (error) {
        return ctx.json({ status: "fail" }, 400);
      }
    }
  )
  .delete("/:workspaceId", sessionMiddleware, async (ctx) => {
    const { workspaceId } = ctx.req.param();
    try {
      await deleteWorkspaceController(workspaceId);
      return ctx.json({ data: { workspaceId } });
    } catch (error) {
      return ctx.json({ status: "fail" }, 400);
    }
  })
  .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (ctx) => {
    const { workspaceId } = ctx.req.param();
    try {
      const workspaceData = await updateWorkspaceInviteCodeController(
        workspaceId
      );
      return ctx.json({ status: "success", data: workspaceData }, 200);
    } catch (error) {
      return ctx.json({ status: "fail" }, 400);
    }
  })
  .post("/:workspaceId/join/:inviteCode", sessionMiddleware, async (ctx) => {
    const { workspaceId, inviteCode } = ctx.req.param();

    try {
      const workspaceData = await joinMemberToWorkspaceController(
        workspaceId,
        inviteCode
      );
      return ctx.json({ status: "success", data: workspaceData });
    } catch (error) {
      return ctx.json({ status: "fail", data: null });
    }
  })

  .get("/:workspaceId/info", sessionMiddleware, async (ctx) => {
    const { workspaceId } = ctx.req.param();
    try {
      const workspaceInfo = await getWorkspaceInfoByIdController(workspaceId);
      return ctx.json({ message: "success", data: workspaceInfo });
    } catch (error) {
      return ctx.json({ message: "fail", data: null });
    }
  })

  // TODO:
  .get("/analytics", sessionMiddleware, async (ctx) => {
    try {
      const data = await getAllWorkspacesAnallticsController();
      return ctx.json({ status: "success", data }, 200);
    } catch (error) {
      return ctx.json({ status: "fail" }, 400);
    }
  })

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
