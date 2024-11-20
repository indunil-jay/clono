import { redirect } from "next/navigation";
import { SingInCard } from "@/app/_features/auth/sign-in-card";
import { getCurrentUserSession } from "@/app/_lib/getCurrentUserSession";

export default async function Page() {
  const user = await getCurrentUserSession();
  if (user) redirect("/");
  return (
    <>
      <SingInCard />
    </>
  );
}
