import { MembersList } from "@/app/_features/members/members-list";
import { getCurrentSessionUser } from "@/app/_lib/getCurrentSessionUser";
import { redirect } from "next/navigation";

interface WorkspaceIdSettingsPageProps {
  params: {
    workspaceId: string;
  };
}

export default async function Page({ params }: WorkspaceIdSettingsPageProps) {
  const user = await getCurrentSessionUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="w-full lg:max-w-xl mx-auto">
      <MembersList />
    </div>
  );
}
