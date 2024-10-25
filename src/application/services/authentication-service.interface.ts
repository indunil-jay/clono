import { User } from "@/src/entities/users";
import { SignUpFormInput } from "@/src/interface-adapter/validation-schemas/auth";
import { Context } from "hono";
/* eslint-disable  @typescript-eslint/no-explicit-any */
export interface IAuthenticationService {
  getUser(): Promise<User>;
  signInWithCredentials(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  signUpWithCredentials(data: SignUpFormInput, ctx: Context): Promise<void>;
}
