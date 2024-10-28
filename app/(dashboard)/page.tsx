import { redirect } from "next/navigation";
import { getCurrentSessionUser } from "@/app/_lib/getCurrentSessionUser";
import { getCurrentWorkspace } from "../_features/workspace/utils";

export default async function Page() {
  const user = await getCurrentSessionUser();

  if (!user) redirect("/sign-in");

  const workspaces = await getCurrentWorkspace();
  console.log(workspaces);
  if (workspaces?.total === 0) {
    redirect("/workspaces/create");
  } else {
    redirect(`/workspaces/${workspaces?.documents[0].$id}`);
  }
}
