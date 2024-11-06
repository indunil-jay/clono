import { Models } from "node-appwrite";
import { z } from "zod";

export const workspacesSchema = z.object({
  name: z.string(),
  userId: z.string(),
  imageUrl: z.string().optional(),
  inviteCode: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Workspace = Models.Document & z.infer<typeof workspacesSchema>;
