import "reflect-metadata";

import { UserButton } from "@/app/_components/features/auth/user-button";
import { redirect } from "next/navigation";
import { getCurrent } from "./(auth)/action";

export default async function Home() {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");
  return (
    <div>
      <UserButton />
    </div>
  );
}
