import { cn } from "@/app/_lib/utils";
import { LoaderCircleIcon } from "lucide-react";

interface SpinnerCircleProps {
  className?: string;
}

export const SpinnerCircle = ({ className }: SpinnerCircleProps) => {
  return <LoaderCircleIcon className={cn("animate-spin", className)} />;
};
