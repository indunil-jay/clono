import { getCurrentUserSession } from "@/app/_lib/getCurrentUserSession";
import { redirect } from "next/navigation";
import { ProjectClient } from "./client";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const user = await getCurrentUserSession();

  if (!user) redirect("/sign-in");

  return <ProjectClient projectId={projectId} />;
}
