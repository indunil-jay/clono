import { Context } from "hono";
import {
  SignInFormInput,
  signInFormSchema,
} from "@/src/interface-adapter/validation-schemas/auth";
import { getInjection } from "@/src/tools/DI/container";

export const signInWithCredentialsController = async (
  input: SignInFormInput,
  ctx: Context
) => {
  const { data, error } = signInFormSchema.safeParse(input);

  if (error) {
    throw new Error("Validation error");
  }

  const authenticationService = getInjection("IAuthenticationService");
  await authenticationService.signInWithCredentials(data, ctx);
};
