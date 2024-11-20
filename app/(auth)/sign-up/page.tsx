import { redirect } from "next/navigation";
import { SingUpCard } from "@/app/_features/auth/sign-up-card";
import { getCurrentUserSession } from "@/app/_lib/getCurrentUserSession";

export default async function Page() {
  const user = await getCurrentUserSession();

  if (user) {
    redirect("/");
  }
  return (
    <>
      <SingUpCard />
    </>
  );
}
