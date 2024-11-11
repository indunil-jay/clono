import { sessionMiddleware } from "@/src/lib/appwrite/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { getMember } from "../members/utils";
import {
  DATABASE_ID,
  IMAGE_BUCKET_ID,
  PROJECTS_COLLECTION_ID,
  TASKS_COLLECTION_ID,
} from "@/src/lib/constants";
import { ID, Query } from "node-appwrite";
import { createProjectSchemaForm, updateProjectSchemaForm } from "./schema";
import { Project } from "./types";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { TaskStatus } from "../tasks/types";

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

      const projects = await databases.listDocuments<Project>(
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
  )
  .patch(
    "/:projectId",
    sessionMiddleware,
    zValidator("form", updateProjectSchemaForm),
    async (ctx) => {
      //
      const databases = ctx.get("databases");
      const user = ctx.get("user");
      const storage = ctx.get("storage");

      // get projectId from param
      const { projectId } = ctx.req.param();

      //get validated form data
      const { name, image } = ctx.req.valid("form");

      const exisitingProject = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_COLLECTION_ID,
        projectId
      );

      //check user allow to do action
      const member = await getMember({
        databases,
        workspaceId: exisitingProject.workspaceId,
        userId: user.$id,
      });

      if (!member) {
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

      const project = await databases.updateDocument(
        DATABASE_ID,
        PROJECTS_COLLECTION_ID,
        projectId,
        { name, imageUrl: uploadedImageUrl }
      );

      return ctx.json({ data: project });
    }
  )
  .delete("/:projectId", sessionMiddleware, async (ctx) => {
    const databases = ctx.get("databases");
    const user = ctx.get("user");
    const storage = ctx.get("storage");
    const { projectId } = ctx.req.param();

    const exisitingProject = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      projectId
    );

    await databases.deleteDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      projectId
    );
    return ctx.json({ data: { $id: projectId } });
  })
  .get("/:projectId/analytics", sessionMiddleware, async (ctx) => {
    const user = ctx.get("user");
    const databases = ctx.get("databases");
    const { projectId } = ctx.req.param();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      projectId
    );

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
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
        Query.equal("projectId", projectId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      [
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
        Query.equal("assigneeId", member.$id),

        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      [
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),

        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthInCompleteTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      [
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
        Query.equal("status", TaskStatus.DONE),

        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthCompletedTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      [
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
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
