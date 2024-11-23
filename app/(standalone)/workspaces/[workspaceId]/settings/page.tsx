import { redirect } from "next/navigation";
import { UpdateWorkspaceForm } from "@/app/_features/workspace/update-workspace-form ";
import { getWorkspaceById } from "@/app/_features/workspace/utils";
import { getCurrentUserSession } from "@/app/_lib/getCurrentUserSession";
import { WorkspaceCollectionDocument } from "@/src/entities/workspace.entity";

export default async function Page({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const user = await getCurrentUserSession();

  if (!user) redirect("/sign-in");

  const { workspaceId } = await params;

  const initialValues = (await getWorkspaceById({
    workspaceId,
  })) as WorkspaceCollectionDocument;

  if (!initialValues) {
    redirect(`/workspace/${workspaceId}`);
  }
  return (
    <div className="w-full lg:max-w-xl mx-auto">
      <UpdateWorkspaceForm initialValues={initialValues} />
    </div>
  );
}
