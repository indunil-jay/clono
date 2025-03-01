"use client";
import { DottedSeparator } from "@/app/_components/custom/dotted-separator";
import { Avatar, AvatarFallback } from "@/app/_components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { useCurrent } from "@/app/_features/auth/hooks/use-current";
import { useLogout } from "@/app/_features/auth/hooks/use-logout";
import { Loader, LogOut } from "lucide-react";

export const UserButton = () => {
  const { data: user, status } = useCurrent();

  const { mutate: logout } = useLogout();
  if (status === "pending") {
    return (
      <div className="size-10 rounded-full flex items-center justify-center border border-neutral-300">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  //TODO: check later
  if (status === "error") {
    return null;
  }

  if (!user) {
    return null;
  }
  const { name, email } = user;
  const avatarFallback = name
    ? name.charAt(0).toUpperCase()
    : email.charAt(0).toUpperCase() ?? "U";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300">
          <AvatarFallback className="bg-neutral-300 font-medium text-neutral-500 flex items-center justify-center">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <Avatar className="size-[52px]  border border-neutral-300">
            <AvatarFallback className="bg-neutral-300 font-medium text-xl text-neutral-500 flex items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-neutral-500">
              {name || "User"}
            </p>
            <p className="text-xs text-neutral-500">{email}</p>
          </div>
        </div>
        <DottedSeparator className="mb-1" />

        <DropdownMenuItem
          onClick={() => logout({ json: {} })}
          className="h-10 flex items-center  justify-center text-amber-700 font-medium cursor-pointer"
        >
          <LogOut className="size-4 mr-2" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
