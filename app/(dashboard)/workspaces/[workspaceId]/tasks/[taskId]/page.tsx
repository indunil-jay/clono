import { getCurrentSessionUser } from "@/app/_lib/getCurrentSessionUser";
import { redirect } from "next/navigation";
import { TaskIdClient } from "./client";

export default async function Page() {
  const user = await getCurrentSessionUser();

  if (!user) redirect("/sign-in");
  return <TaskIdClient />;
}
