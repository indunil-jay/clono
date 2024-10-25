import { getInjection } from "@/DI/container";
import {
  SignUpFormInput,
  signUpFormSchema,
} from "@/src/interface-adapter/validation-schemas/auth";
import { Context } from "hono";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const signUpController = async (
  input: SignUpFormInput,
  ctx: Context
) => {
  //server side validion using zod before send to the server
  const { data, error } = signUpFormSchema.safeParse(input);

  //error handle TODO:
  if (error) {
    console.log(error);
    throw new Error("signup error");
  }

  const authenticationService = getInjection("IAuthenticationService");
  await authenticationService.signUpWithCredentials(data, ctx);
};
