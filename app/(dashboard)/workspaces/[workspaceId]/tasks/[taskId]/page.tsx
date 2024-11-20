import { getCurrentUserSession } from "@/app/_lib/getCurrentUserSession";
import { redirect } from "next/navigation";
import { TaskIdClient } from "./client";

export default async function Page() {
  const user = await getCurrentUserSession();

  if (!user) redirect("/sign-in");
  return <TaskIdClient />;
}
