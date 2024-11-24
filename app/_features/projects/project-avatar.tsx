import Image from "next/image";

import { cn } from "@/app/_lib/utils";
import { Avatar, AvatarFallback } from "@/app/_components/ui/avatar";

interface ProjectAvatarProps {
  image?: string;
  name: string;
  className?: string;
  fallbackClassName?: string;
}

export const ProjectAvatar = ({
  name,
  className,
  image,
  fallbackClassName,
}: ProjectAvatarProps) => {
  if (image) {
    return (
      <div
        className={cn(
          "size-6 relative rounded-full overflow-hidden border border-neutral-200",
          className
        )}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <Avatar className={cn("size-6 rounded-full", className)}>
      <AvatarFallback
        className={cn(
          "text-white bg-neutral-600 font-semibold flex items-center justify-center text-sm uppercase rounded-full border border-neutral-200",
          fallbackClassName
        )}
      >
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
};
