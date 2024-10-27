import { z } from "zod";

export const createWorkspaceSchemaForm = z.object({
  name: z.string().trim().min(1, "Required"),
});
