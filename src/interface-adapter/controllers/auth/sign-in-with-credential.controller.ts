import { Context } from "hono";
import {
  SignInFormInput,
  signInFormSchema,
} from "@/src/interface-adapter/validation-schemas/auth";
import { getInjection } from "@/DI/container";

export const signInWithCredentialsController = async (
  input: SignInFormInput,
  ctx: Context
) => {
  const { data, error } = signInFormSchema.safeParse(input);

  //error handle TODO:
  if (error) {
    console.log(error);
    throw new Error("signup error");
  }

  const authenticationService = getInjection("IAuthenticationService");
  await authenticationService.signInWithCredentials(data, ctx);
};
