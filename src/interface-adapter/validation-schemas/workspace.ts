import { z } from "zod";

export const createWorkspaceFormSchema = z.object({
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
});

export type CreateWorkspaceFormInput = z.infer<
  typeof createWorkspaceFormSchema
>;
