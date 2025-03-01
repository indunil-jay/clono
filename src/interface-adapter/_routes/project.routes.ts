import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { sessionMiddleware } from "@/src/tools/lib/appwrite/session-middleware";
import { createProjectController } from "@/src/interface-adapter/controllers/projects/create-project.controller";
import { getAllProjectsByWorkspaceIdController } from "@/src/interface-adapter/controllers/projects/get-all-projects-by-workspace-id.controller";
import { updateProjectController } from "@/src/interface-adapter/controllers/projects/update-project.controller";
import { deleteProjectController } from "@/src/interface-adapter/controllers/projects/delete-project.controller";
import {
  createProjectFormSchema,
  updateProjectFormSchema,
} from "@/src/interface-adapter/validation-schemas/project";

import { getProjectController } from "@/src/interface-adapter/controllers/projects/get-project.controller";

const app = new Hono()

  .post(
    "/",
    zValidator("form", createProjectFormSchema),
    sessionMiddleware,
    async (ctx) => {
      const { name, image, workspaceId } = ctx.req.valid("form");

      try {
        const projectCollectionDocument = await createProjectController({
          name,
          image,
          workspaceId,
        });
        return ctx.json(
          {
            message: "success",
            data: projectCollectionDocument,
          },
          200
        );
      } catch (error) {
        const err = error as Error;

        return ctx.json(
          
          {
            message: err.message,
            data: null,
          },
          400
        );
      }
    }
  )

  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (ctx) => {
      const { workspaceId } = ctx.req.valid("query");

      if (!workspaceId) {
        return ctx.json({ message: "Missing workspaceId" }, 400);
      }

      try {
        const workspaceAllProjects =
          await getAllProjectsByWorkspaceIdController(workspaceId);
        return ctx.json({ data: workspaceAllProjects, message: "success" });
      } catch (error) {
        const err = error as Error;
        return ctx.json({ message: err.message, data: null });
      }
    }
  )

  .get("/:projectId", sessionMiddleware, async (c) => {
    const { projectId } = c.req.param();

    try {
      const data = await getProjectController(projectId);
      return c.json(data, 200);
    } catch (error) {
      const err = error as Error;
      return c.json({ message: err.message }, 400);
    }
    
  })

  .delete("/:projectId", sessionMiddleware, async (ctx) => {
    const { projectId } = ctx.req.param();

    try {
      await deleteProjectController(projectId);
      return ctx.json({ message: "success" });
    } catch (error) {
      const err = error as Error;
      return ctx.json({ message: err.message });
    }
  })

  .patch(
    "/:projectId",
    sessionMiddleware,
    zValidator("form", updateProjectFormSchema),
    async (ctx) => {
      const { projectId } = ctx.req.param();
      const { name, image } = ctx.req.valid("form");

      try {
        const project = await updateProjectController(projectId, {
          name,
          image,
        });
        return ctx.json({ data: project, message: "success" });
      } catch (error) {
        const err = error as Error;
        return ctx.json({ message: err.message, data: null });
      }
    }
  );

// .get("/:projectId/analytics", sessionMiddleware, async (ctx) => {
//   const user = ctx.get("user");
//   const databases = ctx.get("databases");
//   const { projectId } = ctx.req.param();

//   const project = await databases.getDocument(
//     DATABASE_ID,
//     PROJECTS_COLLECTION_ID,
//     projectId
//   );

//   const member = await getMember({
//     databases,
//     workspaceId: project.workspaceId,
//     userId: user.$id,
//   });

//   if (!member) {
//     return ctx.json({ error: "Unauthorized" }, 401);
//   }

//   const now = new Date();
//   const thisMonthStart = startOfMonth(now);
//   const thisMonthEnd = endOfMonth(now);
//   const lastMonthStart = startOfMonth(subMonths(now, 1));
//   const lastMonthEnd = endOfMonth(subMonths(now, 1));

//   const thisMonthTasks = await databases.listDocuments(
//     DATABASE_ID,
//     TASKS_COLLECTION_ID,
//     [
//       Query.equal("projectId", projectId),
//       Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
//       Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
//     ]
//   );

//   const lastMonthTasks = await databases.listDocuments(
//     DATABASE_ID,
//     TASKS_COLLECTION_ID,
//     [
//       Query.equal("projectId", projectId),
//       Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
//       Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
//     ]
//   );

//   const taskCount = thisMonthTasks.total;
//   const taskDifference = taskCount - lastMonthTasks.total;

//   const thisMonthAssignedTasks = await databases.listDocuments(
//     DATABASE_ID,
//     TASKS_COLLECTION_ID,
//     [
//       Query.equal("projectId", projectId),
//       Query.equal("assigneeId", member.$id),

//       Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
//       Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
//     ]
//   );

//   const lastMonthAssignedTasks = await databases.listDocuments(
//     DATABASE_ID,
//     TASKS_COLLECTION_ID,
//     [
//       Query.equal("projectId", projectId),
//       Query.equal("assigneeId", member.$id),

//       Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
//       Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
//     ]
//   );

//   const assignedTaskCount = thisMonthAssignedTasks.total;
//   const assignedTaskDifference =
//     assignedTaskCount - lastMonthAssignedTasks.total;

//   const thisMonthInCompleteTask = await databases.listDocuments(
//     DATABASE_ID,
//     TASKS_COLLECTION_ID,
//     [
//       Query.equal("projectId", projectId),
//       Query.notEqual("status", TaskStatus.DONE),

//       Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
//       Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
//     ]
//   );

//   const lastMonthInCompleteTask = await databases.listDocuments(
//     DATABASE_ID,
//     TASKS_COLLECTION_ID,
//     [
//       Query.equal("projectId", projectId),
//       Query.notEqual("status", TaskStatus.DONE),

//       Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
//       Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
//     ]
//   );

//   const incompleteTaskCount = thisMonthInCompleteTask.total;
//   const incompleteTaskDifference =
//     incompleteTaskCount - lastMonthInCompleteTask.total;

//   const thisMonthCompletedTask = await databases.listDocuments(
//     DATABASE_ID,
//     TASKS_COLLECTION_ID,
//     [
//       Query.equal("projectId", projectId),
//       Query.equal("status", TaskStatus.DONE),

//       Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
//       Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
//     ]
//   );

//   const lastMonthCompletedTask = await databases.listDocuments(
//     DATABASE_ID,
//     TASKS_COLLECTION_ID,
//     [
//       Query.equal("projectId", projectId),
//       Query.equal("status", TaskStatus.DONE),

//       Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
//       Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
//     ]
//   );

//   const completeTaskCount = thisMonthCompletedTask.total;
//   const completeTaskDifference =
//     completeTaskCount - lastMonthCompletedTask.total;

//   const thisMonthOverdueTasks = await databases.listDocuments(
//     DATABASE_ID,
//     TASKS_COLLECTION_ID,
//     [
//       Query.equal("projectId", projectId),
//       Query.notEqual("status", TaskStatus.DONE),
//       Query.lessThan("dueDate", now.toISOString()),

//       Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
//       Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
//     ]
//   );

//   const lastMonthOverdueTasks = await databases.listDocuments(
//     DATABASE_ID,
//     TASKS_COLLECTION_ID,
//     [
//       Query.equal("projectId", projectId),
//       Query.notEqual("status", TaskStatus.DONE),
//       Query.lessThan("dueDate", now.toISOString()),

//       Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
//       Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
//     ]
//   );

//   const overDueTaskCount = thisMonthOverdueTasks.total;
//   const overDueTaskDifference =
//     overDueTaskCount - lastMonthOverdueTasks.total;

//   return ctx.json({
//     data: {
//       taskCount,
//       taskDifference,
//       assignedTaskCount,
//       assignedTaskDifference,
//       completeTaskCount,
//       completeTaskDifference,
//       incompleteTaskCount,
//       incompleteTaskDifference,
//       overDueTaskCount,
//       overDueTaskDifference,
//     },
//   });
// });

export default app;
