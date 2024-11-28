import { getCurrentUserSession } from "@/app/_lib/getCurrentUserSession";
import { redirect } from "next/navigation";
import { AssigneeDetails } from "./_components/assignee-details";
import { DescriptionCard } from "./_components/description-card";
import { DottedSeparator } from "@/app/_components/custom/dotted-separator";

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
      <AssigneeDetails taskId={taskId} workspaceId={workspaceId} />
      <DottedSeparator className="my-5" />
      <DescriptionCard
        title="Task Details"
        label="Provide a detailed description of the task for the assignee."
      />
      <DottedSeparator className="my-5" />
      <DescriptionCard
        title="Assignee Comments"
        label="Share your insights or updates on the task."
      />
      <DottedSeparator className="my-5" />
      <DescriptionCard
        title="Reviewer Feedback"
        label="Add your thoughts or suggestions regarding the task."
      />
    </div>
  );
}
