import { Models } from "node-appwrite";
import { z } from "zod";

export const workspacesSchema = z.object({
  name: z.string(),
  userId: z.string(),
  imageUrl: z.string().optional(),
  inviteCode: z.string(),
});

export type WorkspacesCollectionInput = z.infer<typeof workspacesSchema>;

const workspacesUpdateSchema = workspacesSchema
  .pick({
    name: true,
    imageUrl: true,
    inviteCode: true,
    userId: true,
  })
  .partial();

export type WorkspacesCollectionUpdateInput = z.infer<
  typeof workspacesUpdateSchema
>;

export type WorkspaceCollectionDocument = Models.Document &
  z.infer<typeof workspacesSchema>;

export type DocumentList<T> = {
  total: number;
  documents: T[];
};
