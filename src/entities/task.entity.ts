import { Models } from "node-appwrite";
import { z } from "zod";
import { TaskStatus } from "./task.enums";

export const taskSchema = z.object({
  name: z.string(),
  projectId: z.string(),
  workspaceId: z.string(),
  assigneeId: z.string(),
  description: z.string(),
  dueDate: z.coerce.date(),
  status: z.nativeEnum(TaskStatus),
  position: z.number(),
});

export type TasksCollectionInput = z.infer<typeof taskSchema>;

export type TasksCollectionDocument = Models.Document &
  z.infer<typeof taskSchema>;
