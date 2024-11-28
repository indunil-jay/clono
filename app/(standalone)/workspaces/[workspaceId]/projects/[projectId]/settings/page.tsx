import { UpdateProjectForm } from "@/app/_features/projects/update-project-form ";
import { getCurrentUserSession } from "@/app/_lib/getCurrentUserSession";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params:Promise<{projectId:string}>;
}) {

  const user = await getCurrentUserSession();
  if (!user) redirect("/sign-in");

  const { projectId } = await params;

  return (
    <div className="w-full lg:max-w-xl mx-auto">
      <UpdateProjectForm projectId={projectId} />
    </div>
  );
}
