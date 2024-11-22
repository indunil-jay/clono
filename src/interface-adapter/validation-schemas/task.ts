import { TaskStatus } from "@/src/entities/task.enums";
import { z } from "zod";

export const createTaskFormSchema = z.object({
  name: z.string().min(1, "Required"),
  status: z.nativeEnum(TaskStatus, { required_error: "Required" }),
  workspaceId: z.string().trim().min(1, "Required"),
  projectId: z.string().trim().min(1, "Required"),
  dueDate: z.coerce.date(),
  assigneeId: z.string().min(1, "Required"),
  description: z.string().optional(),
});
