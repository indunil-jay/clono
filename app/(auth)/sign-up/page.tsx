import { redirect } from "next/navigation";
import { SingUpCard } from "@/app/_components/features/auth/sign-up-card";
import { getCurrentSessionUser } from "@/app/_lib/getCurrentSessionUser";

export default async function Page() {
  const user = await getCurrentSessionUser();

  if (user) {
    redirect("/");
  }
  return (
    <>
      <SingUpCard />
    </>
  );
}
