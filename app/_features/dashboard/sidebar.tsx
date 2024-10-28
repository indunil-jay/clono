import Link from "next/link";
import { Logo } from "@/app/_components/custom/logo";
import { DottedSeparator } from "../../_components/custom/dotted-separator";
import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "../workspace/workspace-switcher";

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
    </aside>
  );
};
