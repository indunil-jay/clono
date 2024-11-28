import { Context } from "hono";

import { getInjection } from "@/src/tools/DI/container";
import {
  SignUpFormInput,
  signUpFormSchema,
} from "@/src/interface-adapter/validation-schemas/auth";

export const signUpController = async (input: SignUpFormInput) => {
  const { data, error } = signUpFormSchema.safeParse(input);

  if (error) {
    throw new Error("Validation error");
  }

  const authenticationService = getInjection("IAuthenticationService");
  await authenticationService.signUpWithCredentials(data);
};
