import { SingInCard } from "@/app/_components/features/auth/sign-in-card";
import { redirect } from "next/navigation";
import { getCurrentSessionUser } from "@/app/_lib/getCurrentSessionUser";

export default async function Page() {
  const user = await getCurrentSessionUser();

  if (user) redirect("/");
  return (
    <>
      <SingInCard />
    </>
  );
}
