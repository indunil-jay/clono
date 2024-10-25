import { SingUpCard } from "@/app/_components/features/auth/sign-up-card";
import { getCurrent } from "@/src/auth/action";
import { redirect } from "next/navigation";

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
