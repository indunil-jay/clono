import { JoinWorkSpaceForm } from "@/app/_features/workspace/join-workspace-form";
import { getWorkspaceInfo } from "@/app/_features/workspace/utils";
import { getCurrentSessionUser } from "@/app/_lib/getCurrentSessionUser";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { workspaceId: string };
}) {
  const user = await getCurrentSessionUser();
  if (!user) redirect("/sign-in");
  const { workspaceId } = await params;
  const workspace = await getWorkspaceInfo({ workspaceId });

  if (!workspace) {
    redirect("/");
  }
  return (
    <div className="w-full lg:max-w-xl mx-auto">
      <JoinWorkSpaceForm initialValues={workspace} />

    
    </div>
  );
}
