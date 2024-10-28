import { getCurrentSessionUser } from "@/app/_lib/getCurrentSessionUser";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { workspaceId: string };
}) {
  const user = await getCurrentSessionUser();

  const { workspaceId } = params;
  if (!user) redirect("/sign-in");
  return <div>workspace id - {workspaceId}</div>;
}
