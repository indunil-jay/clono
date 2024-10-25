"use client";
import { UserButton } from "@/components/features/auth/user-button";
import { Button } from "@/components/ui/button";
import { useCurrent } from "@/src/auth/api/use-current";
import { useLogout } from "@/src/auth/api/use-logout";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data, isLoading } = useCurrent();
  const { mutate } = useLogout();
  const router = useRouter();

  useEffect(() => {
    if (!data && !isLoading) {
      router.push("/sign-in");
    }
  }, [data]);
  return (
    <div>
      <UserButton />
    </div>
  );
}
