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
import { TaskStatus } from "./types";
import { createAdminClient } from "@/src/lib/appwrite/appwrite";
import { error } from "console";
import { Project } from "../projects/types";

const app = new Hono()
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

      const tasks = await databases.listDocuments(
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
  );

export default app;
