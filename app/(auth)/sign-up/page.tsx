import { redirect } from "next/navigation";
import { SingUpCard } from "@/app/_components/features/auth/sign-up-card";
import { getInjection } from "@/DI/container";

export default async function Page() {
  const authenticationService = getInjection("IAuthenticationService");
  const user = await authenticationService.getUser();
  if (user) {
    redirect("/");
  }
  return (
    <>
      <SingUpCard />
    </>
  );
}
