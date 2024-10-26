import { SingInCard } from "@/app/_components/features/auth/sign-in-card";
import { redirect } from "next/navigation";
import { getCurrent } from "../action";

export default async function Page() {
  const user = await getCurrent();

  if (user) redirect("/");
  return (
    <>
      <SingInCard />
    </>
  );
}
