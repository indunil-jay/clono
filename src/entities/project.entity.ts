import { Models } from "node-appwrite";
import { z } from "zod";

export const projectSchema = z.object({
  name: z.string(),
  imageUrl: z.string().optional(),
  workspaceId: z.string(),
});

export type ProjectsCollectionInput = z.infer<typeof projectSchema>;

export type ProjectseCollectionDocument = Models.Document &
  z.infer<typeof projectSchema>;

export const projectUpdateSchema = projectSchema
  .pick({
    name: true,
    imageUrl: true,
  })
  .partial();

export type ProjectsCollectionUpdateInput = z.infer<typeof projectUpdateSchema>;
