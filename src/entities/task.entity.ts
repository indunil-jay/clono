import { Models } from "node-appwrite";
import { z } from "zod";
import { TaskStatus } from "./task.enums";
import { ReviewStatus } from "../interface-adapter/validation-schemas/task";

export const taskSchema = z.object({
  name: z.string(),
  projectId: z.string(),
  workspaceId: z.string(),
  reviwerId: z.string(),
  assigneeId: z.string(),
  dueDate: z.coerce.date(),
  status: z.nativeEnum(TaskStatus),
  position: z.number(),
  description: z.string().optional(),
  assigneeComment: z.string().optional(),
  reviewerComment: z.string().optional(),
  reviewStatus: z.nativeEnum(ReviewStatus),
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
