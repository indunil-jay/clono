import { getCurrentUserSession } from "@/app/_lib/getCurrentUserSession";
import { redirect } from "next/navigation";
import { WorkspaceIdClient } from "./client";

export default async function Page({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { workspaceId } = await params;
  const user = await getCurrentUserSession();

  if (!user) redirect("/sign-in");
  return <WorkspaceIdClient workspaceId={workspaceId} />;
}
