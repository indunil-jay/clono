import { IAuthenticationService } from "@/src/application/services/authentication-service.interface";
import { User } from "@/src/entities/users";
import { SignUpFormInput } from "@/src/interface-adapter/validation-schemas/auth";
import { createAdminClient } from "@/src/lib/appwrite/appwrite";
import { AUTH_COOKIE } from "@/src/lib/constants";
import { Context } from "hono";
import { setCookie } from "hono/cookie";
import { injectable } from "inversify";
import { ID } from "node-appwrite";

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable  @typescript-eslint/no-explicit-any */

@injectable()
export class AuthenticationService implements IAuthenticationService {
  constructor() {}

  public async getUser(): Promise<User> {
    throw new Error("Method not implemented.");
  }
  public async signInWithCredentials(
    email: string,
    password: string
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  public async signOut(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public async signUpWithCredentials(
    data: SignUpFormInput,
    ctx: Context
  ): Promise<void> {
    const { account } = await createAdminClient();
    await account.create(ID.unique(), data.email, data.password, data.username);

    const session = await account.createEmailPasswordSession(
      data.email,
      data.password
    );

    setCookie(ctx, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
}
