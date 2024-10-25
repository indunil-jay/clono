import { SingUpCard } from "@/components/features/auth/sign-up-card";
import { getCurrent } from "@/src/auth/action";
import { revalidatePath } from "next/cache";
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
