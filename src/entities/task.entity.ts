import { Models } from "node-appwrite";
import { z } from "zod";
import { TaskStatus } from "./task.enums";

export const taskSchema = z.object({
  name: z.string(),
  projectId: z.string(),
  workspaceId: z.string(),
  assigneeId: z.string(),
  dueDate: z.coerce.date(),
  status: z.nativeEnum(TaskStatus),
  position: z.number(),
  description: z.string().optional(),
});

export type TasksCollectionInput = z.infer<typeof taskSchema>;

export type TasksCollectionDocument = Models.Document &
  z.infer<typeof taskSchema>;

export const taskQuerySchema = z.object({
  workspaceId: z.string(),
  projectId: z.string().nullish(),
  assigneeId: z.string().nullish(),
  status: z.nativeEnum(TaskStatus).nullish(),
  search: z.string().nullish(),
  dueDate: z.string().nullish(),
});

export type TasksQuery = z.infer<typeof taskQuerySchema>;
