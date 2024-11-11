import { sessionMiddleware } from "@/src/lib/appwrite/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { createTaskSchema } from "./schemas";
import { getMember } from "../members/utils";
import { list } from "postcss";
import {
  DATABASE_ID,
  MEMBERS_COLLECTION_ID,
  PROJECTS_COLLECTION_ID,
  TASKS_COLLECTION_ID,
} from "@/src/lib/constants";
import { ID, Query } from "node-appwrite";
import { Task, TaskStatus } from "./types";
import { createAdminClient } from "@/src/lib/appwrite/appwrite";
import { Project } from "../projects/types";

const app = new Hono()
  .delete("/:taskId", sessionMiddleware, async (ctx) => {
    const user = ctx.get("user");
    const databases = ctx.get("databases");
    const { taskId } = ctx.req.param();

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      taskId
    );
    const member = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return ctx.json({ error: "Unauthrorized" }, 401);
    }

    await databases.deleteDocument(DATABASE_ID, TASKS_COLLECTION_ID, taskId);

    return ctx.json({ data: { $id: task.$id } });
  })

  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
      })
    ),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { users } = await createAdminClient();

      const { workspaceId, projectId, search, status, assigneeId, dueDate } =
        c.req.valid("query");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];

      if (projectId) {
        console.log({ projectId });

        query.push(Query.equal("projectId", projectId));
      }
      if (status) {
        console.log({ status });

        query.push(Query.equal("status", status));
      }
      if (assigneeId) {
        console.log({ assigneeId });

        query.push(Query.equal("assigneeId", assigneeId));
      }
      if (dueDate) {
        console.log({ dueDate });

        query.push(Query.equal("dueDate", dueDate));
      }
      if (search) {
        console.log({ search });

        query.push(Query.search("name", search));
      }

      const tasks = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        query
      );

      const projectIds = tasks.documents.map((task) => task.projectId);
      const assigneeIds = tasks.documents.map((task) => task.assigneeId);

      const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_COLLECTION_ID,
        projectIds.length > 0 ? [Query.contains("$id", projectIds)] : []
      );

      const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_COLLECTION_ID,
        assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : []
      );

      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);

          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        })
      );

      const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find(
          (project) => project.$id === task.projectId
        );
        const assignee = assignees.find(
          (assignee) => assignee.$id === task.assigneeId
        );

        return {
          ...task,
          project,
          assignee,
        };
      });

      return c.json({
        ...tasks,
        documents: populatedTasks,
      });
    }
  )

  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const {
        name,
        workspaceId,
        status,
        projectId,
        assigneeId,
        dueDate,
        description,
      } = c.req.valid("json");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const highestPostionTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        [
          Query.equal("status", status),
          Query.equal("workspaceId", workspaceId),
          Query.orderAsc("position"),
          Query.limit(1),
        ]
      );

      const newPosition: number =
        highestPostionTask.documents.length > 0
          ? highestPostionTask.documents[0].position + 1000
          : 1000;

      console.log({ projectId });

      const task = await databases.createDocument(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        ID.unique(),
        {
          name,
          status,
          workspaceId,
          projectId,
          dueDate,
          assigneeId,
          description,
          position: +newPosition,
        }
      );

      return c.json({ data: task });
    }
  )
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator("json", createTaskSchema.partial()),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const {
        name,
        workspaceId,
        status,
        projectId,
        assigneeId,
        dueDate,
        description,
      } = c.req.valid("json");

      const { taskId } = c.req.param();

      const existingTask = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        taskId
      );

      const member = await getMember({
        databases,
        workspaceId: existingTask.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const task = await databases.updateDocument(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        taskId,
        {
          name,
          status,
          projectId,
          dueDate,
          assigneeId,
          description,
        }
      );

      return c.json({ data: task });
    }
  )
  .get(
    "/:taskId",
    sessionMiddleware,
    zValidator("param", z.object({ taskId: z.string() })),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { taskId } = c.req.param();
      const { users } = await createAdminClient();

      const existingTask = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        taskId
      );

      const member = await getMember({
        databases,
        workspaceId: existingTask.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const project = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_COLLECTION_ID,
        existingTask.projectId
      );

      const assigneeDoc = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_COLLECTION_ID,
        existingTask.assigneeId
      );

      const currentUser = await users.get(assigneeDoc.userId);

      const assignee = {
        ...assigneeDoc,
        name: currentUser.name,
        email: currentUser.email,
      };

      return c.json({
        data: {
          ...existingTask,
          project,
          assignee,
        },
      });
    }
  )
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

      const tasksToUpdates = await databases.listDocuments<Task>(
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
          return databases.updateDocument<Task>(
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
  )
  .get("/:projectId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { projectId } = c.req.param();

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
      return c.json({ error: "Unauthorized" }, 401);
    }

    return c.json({ data: project });
  });

export default app;
