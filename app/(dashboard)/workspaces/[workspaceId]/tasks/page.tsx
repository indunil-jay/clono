import { TaskViewSwitcher } from "@/app/_features/tasks/task-view-switcher";
import { getCurrentUserSession } from "@/app/_lib/getCurrentUserSession";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getCurrentUserSession();

  if (!user) redirect("/sign-in");
  return (
    <div className="h-full flex flex-col">
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
}
