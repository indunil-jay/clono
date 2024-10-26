import { UserButton } from "@/app/_components/features/auth/user-button";
import { redirect } from "next/navigation";
import { getCurrentSessionUser } from "@/app/_lib/getCurrentSessionUser";

export default async function Page() {
  const user = await getCurrentSessionUser();

  if (!user) redirect("/sign-in");
  return <div>home page</div>;
}
