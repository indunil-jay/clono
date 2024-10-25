import { User } from "@/src/entities/users";
import {
  SignInFormInput,
  SignUpFormInput,
} from "@/src/interface-adapter/validation-schemas/auth";
import { Context } from "hono";
import { Models } from "node-appwrite";
/* eslint-disable  @typescript-eslint/no-explicit-any */
export interface IAuthenticationService {
  //TODO: make sure type
  getUser(): Promise<Promise<Models.User<Models.Preferences>> | undefined>;

  signInWithCredentials(
    inputData: SignInFormInput,
    ctx: Context
  ): Promise<void>;

  signOut(ctx: Context): Promise<void>;

  signUpWithCredentials(
    inputData: SignUpFormInput,
    ctx: Context
  ): Promise<void>;
}
