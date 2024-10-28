import { CreateWorkspaceForm } from "@/app/_features/workspace/create-workspace-form";
import { getCurrentSessionUser } from "@/app/_lib/getCurrentSessionUser";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getCurrentSessionUser();

  if (!user) redirect("/sign-in");
  return (
    <div className="w-full lg:max-w-xl mx-auto">
      <CreateWorkspaceForm />
    </div>
  );
}
