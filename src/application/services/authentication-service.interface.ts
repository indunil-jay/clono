import { Context } from "hono";
import { Models } from "node-appwrite";
import {
  SignInFormInput,
  SignUpFormInput,
} from "@/src/interface-adapter/validation-schemas/auth";

export interface IAuthenticationService {
  getUser(): Promise<Promise<Models.User<Models.Preferences>> | undefined>;

  signInWithCredentials(
    inputData: SignInFormInput,
    ctx: Context
  ): Promise<void>;

  signOut(ctx: Context): Promise<void>;

  signUpWithCredentials(inputData: SignUpFormInput): Promise<void>;
}
