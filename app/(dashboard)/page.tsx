import { redirect } from "next/navigation";
import { getCurrentSessionUser } from "@/app/_lib/getCurrentSessionUser";
import { CreateWorkspaceForm } from "../_components/features/workspace/create-workspace-form";

export default async function Page() {
  const user = await getCurrentSessionUser();

  if (!user) redirect("/sign-in");
  return (
    <div>
      home page
      <CreateWorkspaceForm />
    </div>
  );
}
