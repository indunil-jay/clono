import Link from "next/link";

import { Logo } from "@/app/_components/custom/logo";
import { DottedSeparator } from "@/app/_components/custom/dotted-separator";
import { Navigation } from "@/app/_features/dashboard/navigation";
import { WorkspaceSwitcher } from "@/app/_features/workspace/workspace-switcher";
import { Projects } from "@/app/_features/projects/projects";

export const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link href={"/"}>
        <Logo />
      </Link>
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <Navigation />
      <DottedSeparator className="my-4" />
      <Projects />
    </aside>
  );
};
