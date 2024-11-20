import { JoinWorkSpaceForm } from "@/app/_features/workspace/join-workspace-form";
import { getWorkspaceInfo } from "@/app/_features/workspace/utils";
import { getCurrentUserSession } from "@/app/_lib/getCurrentUserSession";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { workspaceId: string };
}) {
  const user = await getCurrentUserSession();
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
