import { z } from "zod";

export const signUpFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." }),
  email: z.string().trim().min(1, { message: "Email is required." }).email(),
  password: z
    .string()
    .min(1, { message: "Password is required." })
    .min(8, { message: "Password must be at least 8 characters required." })
    .max(20, { message: "Password must be lesst then 20 characters." }),
});
