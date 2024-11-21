import { Context } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { injectable } from "inversify";
import { cookies } from "next/headers";
import { Account, Client, ID, Models } from "node-appwrite";

import { IAuthenticationService } from "@/src/application/services/authentication-service.interface";
import {
  SignInFormInput,
  SignUpFormInput,
} from "@/src/interface-adapter/validation-schemas/auth";
import { createAdminClient } from "@/src/lib/appwrite/appwrite";
import { AUTH_COOKIE } from "@/src/lib/constants";

@injectable()
export class AuthenticationService implements IAuthenticationService {
  constructor() {}

  public async getUser(): Promise<
    Promise<Models.User<Models.Preferences>> | undefined
  > {
    try {
      const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

      const session = (await cookies()).get(AUTH_COOKIE);

      if (!session || session.value) return;

      client.setSession(session.value);

      const account = new Account(client);

      return await account.get();
    } catch (error) {
      throw error;
    }
  }

  public async signInWithCredentials(
    inputData: SignInFormInput,
    ctx: Context
  ): Promise<void> {
    try {
      const { account } = await createAdminClient();
      const session = await account.createEmailPasswordSession(
        inputData.email,
        inputData.password
      );

      setCookie(ctx, AUTH_COOKIE, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });
    } catch (error) {
      throw new Error(
        "Invalid credentials. Please check the email and password"
      );
    }
  }

  public async signWithProviders() {
    const { account } = await createAdminClient();
  }

  public async signOut(ctx: Context): Promise<void> {
    const account = ctx.get("account");
    deleteCookie(ctx, AUTH_COOKIE);
    await account.deleteSessions();
  }

  public async signUpWithCredentials(
    inputData: SignUpFormInput
  ): Promise<void> {
    const { account } = await createAdminClient();

    try {
      await account.create(
        ID.unique(),
        inputData.email,
        inputData.password,
        inputData.username
      );
    } catch (error) {
      const errorMsg = error as Error;
      throw new Error(errorMsg.message);
    }
  }
}