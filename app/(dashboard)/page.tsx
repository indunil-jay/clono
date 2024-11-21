import { redirect } from "next/navigation";
import { getCurrentWorkspace } from "@/app/_features/workspace/utils";
import { getCurrentUserSession } from "@/app/_lib/getCurrentUserSession";

export default async function Page() {
  const user = await getCurrentUserSession();
  if (!user) redirect("/sign-in");

  const workspaces = await getCurrentWorkspace();

  console.log({ workspaces });

  if (workspaces?.total === 0) {
    redirect("/workspaces/create");
  } else {
    redirect(`/workspaces/${workspaces?.documents[0].$id}`);
  }
}
