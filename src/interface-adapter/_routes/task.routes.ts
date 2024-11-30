import { sessionMiddleware } from "@/src/tools/lib/appwrite/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { DATABASE_ID, TASKS_COLLECTION_ID } from "@/src/tools/lib/constants";
import { Query } from "node-appwrite";
import { getMember } from "@/app/_features/members/utils";
import { createTaskController } from "@/src/interface-adapter/controllers/tasks/create-task.controller";
import { deleteTaskController } from "@/src/interface-adapter/controllers/tasks/delete-task.controller";
import { getTaskController } from "@/src/interface-adapter/controllers/tasks/get-task.controller";
import { taskQuerySchema } from "@/src/entities/task.entity";
import { getAllTasksByWorkspacceIdController } from "@/src/interface-adapter/controllers/tasks/get-all-tasks-by-workspace-id.controller";
import { TaskStatus } from "@/src/entities/task.enums";
import {
  createTaskFormSchema,
  updateTaskExtendedFormSchema,
} from "@/src/interface-adapter/validation-schemas/task";
import { updateTaskController } from "@/src/interface-adapter/controllers/tasks/update-task.controller";

const app = new Hono()
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskFormSchema),
    async (c) => {
      const {
        name,
        workspaceId,
        status,
        projectId,
        assigneeId,
        dueDate,
        description,
      } = c.req.valid("json");

      try {
        const task = await createTaskController({
          name,
          workspaceId,
          status,
          projectId,
          assigneeId,
          dueDate,
          description,
        });
        return c.json({ data: task });
      } catch {
        //TODO:error response
      }
    }
  )
  .delete("/:taskId", sessionMiddleware, async (ctx) => {
    const { taskId } = ctx.req.param();

    try {
      await deleteTaskController(taskId);
      return ctx.json({ message: "success" }, 200);
    } catch (error) {
      const err = error as Error;
      return ctx.json({ message: err.message }, 400);
    }
  })

  .get("/:taskId", sessionMiddleware, async (c) => {
    const { taskId } = c.req.param();
    try {
      const data = await getTaskController(taskId);
      return c.json({ data, message: "success" }, 200);
    } catch (error) {
      const err = error as Error;
      return c.json({ message: err.message }, 400);
    }
  })

  //filter
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", taskQuerySchema),
    async (ctx) => {
      const { workspaceId, projectId, search, status, assigneeId, dueDate } =
        ctx.req.valid("query");
      try {
        const data = await getAllTasksByWorkspacceIdController({
          workspaceId,
          projectId,
          search,
          status,
          assigneeId,
          dueDate,
        });
        return ctx.json({ data }, 200);
      } catch (err) {
        const error = err as Error;

        return ctx.json({ message: error.message, data: [] }, 400);
      }
    }
  )

  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator("json", updateTaskExtendedFormSchema),
    async (c) => {
      let {
        name,
        status,
        assigneeId,
        dueDate,
        description,
        assigneeComment,
        reviewerComment,
        reviewStatus,
      } = c.req.valid("json");

      const { taskId } = c.req.param();

      try {
        const task = await updateTaskController(taskId, {
          name,
          status,
          assigneeId,
          dueDate,
          description,
          assigneeComment,
          reviewerComment,
          reviewStatus,
        });
        return c.json({ data: task }, 200);
      } catch (error) {
        const err = error as Error;
        return c.json({ error: err.message }, 400);
      }
    }
  )

  //this is for updating kanban board
  .post(
    "/bulk-updates",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        tasks: z.array(
          z.object({
            $id: z.string(),
            status: z.nativeEnum(TaskStatus),
            position: z.number().int().positive().min(1000).max(1_000_000),
          })
        ),
      })
    ),
    async (c) => {
      const databases = c.get("databases");
      const { tasks } = c.req.valid("json");
      const user = c.get("user");

      const tasksToUpdates = await databases.listDocuments(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        [
          Query.contains(
            "$id",
            tasks.map((task) => task.$id)
          ),
        ]
      );

      const workspaceIds = new Set(
        tasksToUpdates.documents.map((task) => task.workspaceId)
      );

      if (workspaceIds.size !== 1) {
        return c.json({ error: "All tasks must belong to the same workspace" });
      }

      const workspaceId = workspaceIds.values().next().value;

      const member = await getMember({
        databases,
        workspaceId: workspaceId!,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const updatedTasks = await Promise.all(
        tasks.map(async (task) => {
          const { $id, status, position } = task;
          return databases.updateDocument(
            DATABASE_ID,
            TASKS_COLLECTION_ID,
            $id,
            {
              status,
              position,
            }
          );
        })
      );
      return c.json({ data: updatedTasks });
    }
  );

export default app;
