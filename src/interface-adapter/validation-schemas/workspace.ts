import { z } from "zod";

export const createWorkspaceFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Required")
        .min(3, "Must be 3 or more characters"),
    // image: z
    //     .union([
    //         typeof File !== "undefined" ? z.instanceof(File) : z.any(),
    //         z.string().transform((value) => (value === "" ? undefined : value)),
    //     ])
    //     .optional(),

    image: z.string().optional(),
});

export type CreateWorkspaceFormInput = z.infer<
    typeof createWorkspaceFormSchema
>;

export const updateWorkspaceFormSchema = z.object({
    name: z.string().trim().min(3, "Must be 3 or more characters").optional(),
    // image: z
    //     .union([
    //         typeof File !== "undefined" ? z.instanceof(File) : z.any(),
    //         z.string().transform((value) => (value === "" ? undefined : value)),
    //     ])
    //     .optional(),
    image: z.string().optional(),
});

export type UpdateWorkspaceFormInput = z.infer<
    typeof updateWorkspaceFormSchema
>;
