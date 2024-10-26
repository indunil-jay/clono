import { redirect } from "next/navigation";
import { SingUpCard } from "@/app/_components/features/auth/sign-up-card";
import { getCurrent } from "../action";

export default async function Page() {
  const user = await getCurrent();

  if (user) {
    redirect("/");
  }
  return (
    <>
      <SingUpCard />
    </>
  );
}
