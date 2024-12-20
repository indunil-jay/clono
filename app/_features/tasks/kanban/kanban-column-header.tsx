import {
  Circle,
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashed,
  CircleDotIcon,
  PlusIcon,
} from "lucide-react";
import { TaskStatus } from "./types";
import { snakeCaseToTitleCase } from "./utils";
import { Button } from "@/app/_components/ui/button";
import { useCreateTaskModal } from "./hooks/use-create-task-modal";

interface KanbanColumnHeader {
  board: TaskStatus;
  taskCount: number;
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.BACKLOG]: (
    <CircleDashedIcon className="size-[18px] text-pink-400" />
  ),
  [TaskStatus.TODO]: <Circle className="size-[18px] text-red-400" />,
  [TaskStatus.IN_PROGRESS]: (
    <CircleDotDashed className="size-[18px] text-yellow-400" />
  ),
  [TaskStatus.IN_REVIEW]: (
    <CircleDotIcon className="size-[18px] text-blue-400" />
  ),
  [TaskStatus.DONE]: (
    <CircleCheckIcon className="size-[18px] text-emerald-400" />
  ),
};

export const KanbanColumnHeader = ({
  board,
  taskCount,
}: KanbanColumnHeader) => {
  const { open } = useCreateTaskModal();
  const icon = statusIconMap[board];
  return (
    <div className="px-2 py-1.5 flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        {icon}
        <h2 className="text-sm font-medium">{snakeCaseToTitleCase(board)}</h2>
        <div className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-neutral-700 font-medium">
          {taskCount}
        </div>
      </div>

      <Button onClick={open} variant={"ghost"} size={"icon"} className="size-5">
        <PlusIcon className="size-4 text-neutral-500" />
      </Button>
    </div>
  );
};
