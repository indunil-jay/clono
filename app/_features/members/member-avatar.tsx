import { Avatar, AvatarFallback } from "@/app/_components/ui/avatar";
import { cn } from "@/app/_lib/utils";

interface MemberAvatarProps {
  name: string;
  className?: string;
  fallbackClassName?: string;
}

export const MemberAvatar = ({
  name,
  className,
  fallbackClassName,
}: MemberAvatarProps) => {
  return (
    <Avatar
      className={cn(
        "size-5 transition rounded-full border border-neutral-300",
        className
      )}
    >
      <AvatarFallback
        className={cn(
          "bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center",
          fallbackClassName
        )}
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
