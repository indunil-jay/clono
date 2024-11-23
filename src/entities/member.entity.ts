import { Models } from "node-appwrite";
import { z } from "zod";

export const memberSchema = z.object({
  userId: z.string(),
  workspaceId: z.string(),
  role: z.string().optional(),
});

export type MemberCollectionInput = z.infer<typeof memberSchema>;

export type MemberCollectionDocument = Models.Document &
  z.infer<typeof memberSchema>;

const workspacesUpdateSchema = memberSchema
  .pick({
    role: true,
  })
  .partial();

export type MemberCollectionUpdateInput = z.infer<
  typeof workspacesUpdateSchema
>;
