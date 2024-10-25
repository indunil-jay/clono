import { SingInCard } from "@/app/_components/features/auth/sign-in-card";
import { getInjection } from "@/DI/container";
import { redirect } from "next/navigation";

export default async function Page() {
  const authenticationService = getInjection("IAuthenticationService");
  const user = await authenticationService.getUser();
  if (user) redirect("/");
  return (
    <>
      <SingInCard />
    </>
  );
}
