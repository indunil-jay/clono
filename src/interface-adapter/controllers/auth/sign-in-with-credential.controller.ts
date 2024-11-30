import { Context } from "hono";
import {
  SignInFormInput,
  signInFormSchema,
} from "@/src/interface-adapter/validation-schemas/auth";
import { getInjection } from "@/src/tools/DI/container";
import { InputParseError } from "@/src/entities/errors/common-errors";

export const signInWithCredentialsController = async (
  input: SignInFormInput,
  ctx: Context
) => {
  const { data, error } = signInFormSchema.safeParse(input);

  if (error) {
    throw new InputParseError(error.message, { cause: error });
  }

  const authenticationService = getInjection("IAuthenticationService");
  await authenticationService.signInWithCredentials(data, ctx);
};
