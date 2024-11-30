import { ReviewStatus, TaskStatus } from "@/src/entities/task.enums";
import { z } from "zod";

export const createTaskFormSchema = z.object({
  name: z.string().min(1, "Required"),
  status: z.nativeEnum(TaskStatus, { required_error: "Required" }),
  workspaceId: z.string().trim().min(1, "Required"),
  projectId: z.string().trim().min(1, "Required"),
  dueDate: z.coerce.date(),
  assigneeId: z.string().min(1, "Required"),
  description: z.string().optional().nullable(),
});

export type CreateTaskFromInput = z.infer<typeof createTaskFormSchema>;

export const updateTaskFromSchema = createTaskFormSchema
  .omit({
    workspaceId: true,
    projectId: true,
  })
  .partial();

export const updateTaskExtendedFormSchema = updateTaskFromSchema
  .extend({
    reviewerComment: z.string().optional().nullable(),
    assigneeComment: z.string().optional().nullable(),
    reviewerId: z.string().min(1, "Required").optional().nullable(),
    reviewStatus: z
      .nativeEnum(ReviewStatus, { required_error: "Required" })
      .optional()
      .nullable(),
  })
  .partial();

export type UpdateTaskFromInput = z.infer<typeof updateTaskFromSchema>;
