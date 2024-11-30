import { getInjection } from "@/src/tools/DI/container";
import {
  SignUpFormInput,
  signUpFormSchema,
} from "@/src/interface-adapter/validation-schemas/auth";
import { InputParseError } from "@/src/entities/errors/common-errors";

export const signUpController = async (input: SignUpFormInput) => {
  const { data, error } = signUpFormSchema.safeParse(input);

  if (error) {
    throw new InputParseError(error.name, { cause: error });
  }

  const authenticationService = getInjection("IAuthenticationService");
  await authenticationService.signUpWithCredentials(data);
};
