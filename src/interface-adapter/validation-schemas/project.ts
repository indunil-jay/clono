import { z } from "zod";

export const createProjectFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Required")
    .min(3, "Must be 3 or more characters"),
  image: z.union([
    z.instanceof(File),
    z
      .string()
      .transform((value) => (value === "" ? undefined : value))
      .optional(),
  ]),
  workspaceId: z.string(),
});

export type CreateProjectFromInput = z.infer<typeof createProjectFormSchema>;

export const updateProjectFormSchema = z.object({
  name: z.string().trim().min(3, "Must be 3 or more characters").optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});

export type UpdateProjectFromInput = z.infer<typeof updateProjectFormSchema>;
