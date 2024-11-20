import { CreateWorkspaceForm } from "@/app/_features/workspace/create-workspace-form";
import { getCurrentUserSession } from "@/app/_lib/getCurrentUserSession";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getCurrentUserSession();

  if (!user) redirect("/sign-in");
  return (
    <div className="w-full lg:max-w-xl mx-auto">
      <CreateWorkspaceForm />
    </div>
  );
}
