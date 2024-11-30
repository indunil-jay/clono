"use client";
import { Logo } from "@/app/_components/custom/logo";
import { Button } from "@/app/_components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const AuthNav = () => {
      const pathname = usePathname();
  return (
    <div className="sticky top-0 h-auto backdrop-blur-lg  p-4 bg-secondary/20  border-b">
      <nav className="flex justify-between items-center ">
        <Logo/>
        <Button asChild>
          <Link href={pathname === "/sign-in" ? "/sign-up" : "/sign-in"}>
            {pathname === "/sign-in" ? "Sign Up" : "Sign in"}
          </Link>
        </Button>
      </nav>
    </div>
  );
};
