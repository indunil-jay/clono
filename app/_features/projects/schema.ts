import { z } from "zod";

export const createProjectSchemaForm = z.object({
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

export const updateProjectSchemaForm = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Required")
    .min(3, "Must be 3 or more characters")
    .optional(),
  image: z.union([
    z.instanceof(File),
    z
      .string()
      .transform((value) => (value === "" ? undefined : value))
      .optional(),
  ]),
});
