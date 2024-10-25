import "reflect-metadata";

import { UserButton } from "@/app/_components/features/auth/user-button";
import { getCurrent } from "@/src/auth/action";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");
  return (
    <div>
      <UserButton />
    </div>
  );
}
