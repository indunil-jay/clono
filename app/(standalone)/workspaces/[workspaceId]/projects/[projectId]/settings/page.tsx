import { UpdateProjectForm } from "@/app/_features/projects/update-project-form ";
import { getProjectById } from "@/app/_features/projects/utils";
import { getCurrentUserSession } from "@/app/_lib/getCurrentUserSession";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { projectId: string };
}) {
  const user = await getCurrentUserSession();

  if (!user) redirect("/sign-in");

  const { projectId } = await params;

  const project = await getProjectById({ projectId });

  if (!project) return;

  return (
    <div className="w-full lg:max-w-xl">
      <UpdateProjectForm initialValues={project} />
    </div>
  );
}
