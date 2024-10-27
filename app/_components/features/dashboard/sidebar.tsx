import Link from "next/link";
import { Logo } from "@/app/_components/custom/logo";
import { DottedSeparator } from "../../custom/dotted-separator";
import { Navigation } from "./navigation";

export const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link href={"/"}>
        <Logo />
      </Link>
      <DottedSeparator className="my-4" />
      <Navigation />
    </aside>
  );
};