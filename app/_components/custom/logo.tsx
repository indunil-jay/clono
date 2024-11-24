import { Webhook } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[22px] font-semibold uppercase">Clono</span>
      <span className="text-[28px] font-semibold">
        <Webhook />
      </span>
    </div>
  );
};
