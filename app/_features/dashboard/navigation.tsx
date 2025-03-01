"use client";
import { cn } from "@/app/_lib/utils";
import { Settings, SettingsIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import { redirect, useParams, usePathname } from "next/navigation";

const routes = [
  {
    id: 1,
    label: "Home",
    href: "",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    id: 2,
    label: "My Task",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    id: 3,
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: Settings,
  },
  {
    id: 4,
    label: "Members",
    href: "/members",
    icon: UserIcon,
    activeIcon: UserIcon,
  },
];

export const Navigation = () => {
  const { workspaceId } = useParams();
  const pathname = usePathname();

  if (!workspaceId) {
    return;
  }

  return (
    <ul className="flex flex-col">
      {routes.map((item) => {
        const href = `/workspaces/${workspaceId}${item.href}`;
        const isActive = pathname === href;
        const Icon = isActive ? item.activeIcon : item.icon;
        return (
          <li key={item.id}>
            <Link href={href}>
              <div
                className={cn(
                  "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                  isActive &&
                    "bg-white shadow-sm hover:opacity-100 text-primary"
                )}
              >
                <Icon className="size-5 text-neutral-500" />
                {item.label}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
