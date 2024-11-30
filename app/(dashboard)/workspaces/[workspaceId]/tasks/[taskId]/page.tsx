import { getCurrentUserSession } from "@/app/_lib/getCurrentUserSession";
import { redirect } from "next/navigation";
import { UpdateAssigneeForm } from "./_components/update-assignee-form";

export default async function Page({
  params,
}: {
  params: Promise<{ taskId: string; workspaceId: string }>;
}) {
  const user = await getCurrentUserSession();

  if (!user) redirect("/sign-in");

  const { taskId, workspaceId } = await params;

  return (
    <div className="max-w-screen-md mx-auto w-full min-h-screen ">
      <UpdateAssigneeForm
        taskId={taskId}
        workspaceId={workspaceId}
        sessionUserId={user.$id}
      />
    </div>
  );
}
