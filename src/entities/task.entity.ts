import { Models } from "node-appwrite";
import { z } from "zod";
import { ReviewStatus, TaskStatus } from "./task.enums";

export const createTaskSchema = z.object({
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

export type TasksCollectionInput = z.infer<typeof createTaskSchema>;

export type TasksCollectionDocument = Models.Document &
  z.infer<typeof createTaskSchema>;

export const taskQuerySchema = z.object({
  workspaceId: z.string(),
  projectId: z.string().nullish(),
  assigneeId: z.string().nullish(),
  status: z.nativeEnum(TaskStatus).nullish(),
  search: z.string().nullish(),
  dueDate: z.string().nullish(),
});

export type TasksQuery = z.infer<typeof taskQuerySchema>;

export const updateTaskExtendedFormSchema = createTaskSchema
  .extend({
    description: z.string().optional().nullable(),
    reviewerComment: z.string().optional().nullable(),
    assigneeComment: z.string().optional().nullable(),
    reviewerId: z.string().min(1, "Required").optional().nullable(),
    reviewStatus: z
      .nativeEnum(ReviewStatus, { required_error: "Required" })
      .optional()
      .nullable(),
  })
  .partial();

export type UpdateTaskFromInput = z.infer<typeof updateTaskExtendedFormSchema>;
