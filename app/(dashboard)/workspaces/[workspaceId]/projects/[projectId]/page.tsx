import { getCurrentUserSession } from "@/app/_lib/getCurrentUserSession";
import { redirect } from "next/navigation";
import { ProjectDetails } from "./_components/project-details";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const user = await getCurrentUserSession();

  if (!user) redirect("/sign-in");

  return <ProjectDetails projectId={projectId} />;
}
