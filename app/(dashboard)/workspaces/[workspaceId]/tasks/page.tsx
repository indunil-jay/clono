import { TaskViewSwitcher } from "@/app/_features/tasks/task-view-switcher";
import { getCurrentSessionUser } from "@/app/_lib/getCurrentSessionUser";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getCurrentSessionUser();

  if (!user) redirect("/sign-in");
  return (
    <div className="h-full flex flex-col">
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
}
