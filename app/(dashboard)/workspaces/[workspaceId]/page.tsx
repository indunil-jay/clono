import { getCurrentUserSession } from "@/app/_lib/getCurrentUserSession";
import { redirect } from "next/navigation";
import { Workspace } from "./workspace";

export default async function Page({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  const user = await getCurrentUserSession();
  if (!user) redirect("/sign-in");
  return <Workspace workspaceId={workspaceId} />;
}
