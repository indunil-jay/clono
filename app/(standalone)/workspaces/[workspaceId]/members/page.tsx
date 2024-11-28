import { redirect } from "next/navigation";
import { MembersList } from "@/app/_features/members/members-list";
import { getCurrentUserSession } from "@/app/_lib/getCurrentUserSession";



export default async function Page() {
  const user = await getCurrentUserSession();
  if (!user) redirect("/sign-in");

  return (
    <div className="w-full lg:max-w-xl mx-auto">
      <MembersList />
    </div>
  );
}
