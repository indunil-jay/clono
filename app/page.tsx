import "reflect-metadata";

import { UserButton } from "@/app/_components/features/auth/user-button";
import { redirect } from "next/navigation";
import { getInjection } from "@/DI/container";

export default async function Home() {
  const authenticationService = getInjection("IAuthenticationService");
  const user = await authenticationService.getUser();

  if (!user) redirect("/sign-in");
  return (
    <div>
      <UserButton />
    </div>
  );
}
