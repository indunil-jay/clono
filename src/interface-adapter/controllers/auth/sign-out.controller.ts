import { getInjection } from "@/src/tools/DI/container";
import { Context } from "hono";

export const signOutController = async (ctx: Context) => {
  const authenticationService = getInjection("IAuthenticationService");
  await authenticationService.signOut(ctx);
};
