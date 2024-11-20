import { UpdateWorkspaceForm } from "@/app/_features/workspace/update-workspace-form ";
import { getWorkspaceById } from "@/app/_features/workspace/utils";
import { getCurrentUserSession } from "@/app/_lib/getCurrentUserSession";
import { redirect } from "next/navigation";

interface WorkspaceIdSettingsPageProps {
  params: {
    workspaceId: string;
  };
}

export default async function Page({ params }: WorkspaceIdSettingsPageProps) {
  const user = await getCurrentUserSession();
  const { workspaceId } = await params;
  if (!user) redirect("/sign-in");

  const initialValues = await getWorkspaceById({
    workspaceId,
  });

  //TODO: check again and  handle proper erro
  if (!initialValues) {
    redirect(`/workspace/${params.workspaceId}`);
  }
  return (
    <div className="w-full lg:max-w-xl mx-auto">
      <UpdateWorkspaceForm initialValues={initialValues} />
    </div>
  );
}
