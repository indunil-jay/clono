import { Models } from "node-appwrite";
import { z } from "zod";

export const workspacesSchema = z.object({
  name: z.string(),
  userId: z.string(),
  imageUrl: z.string().optional(),
  inviteCode: z.string(),
});

export type WorkspacesCollectionInput = z.infer<typeof workspacesSchema>;

export type WorkspaceCollectionDocument = Models.Document &
  z.infer<typeof workspacesSchema>;
