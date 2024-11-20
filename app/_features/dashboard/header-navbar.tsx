"use client";
import { UserButton } from "@/app/_features/auth/user-button";
import { MobileSidebar } from "@/app/_features/dashboard/mobile-sidebar";
import { usePathname } from "next/navigation";

const pathnameMap = {
  tasks: {
    title: "my-tasks",
    description: "view all of your tasks here.",
  },
  projects: {
    title: "my-projects",
    description: "view all tasks of  project.",
  },
};

const defaultMap = {
  title: "Home",
  description: "Monitor all of your projects and task here",
};

export const HeaderNavbar = () => {
  const pathname = usePathname();

  const pathnameParts = pathname.split("/");
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;
  const { description, title } = pathnameMap[pathnameKey] || defaultMap;
  return (
    <nav className="pt-4 px-6 flex items-center justify-between ">
      <div className="hidden flex-col  lg:flex">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* mobile view */}
      <MobileSidebar />
      <UserButton />
    </nav>
  );
};
