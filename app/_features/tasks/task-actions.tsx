"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { ExternalLinkIcon, Pencil, PencilIcon, Trash } from "lucide-react";
import { useDeleteTask } from "./hooks/useDeleteTask";
import { useConfirmModal } from "@/app/_components/custom/use-confirm-modal";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "../workspace/hooks/useWorkspaceId";
import { useUpdateTaskModal } from "./hooks/useUpdateTaskModal";

interface TaskActionsProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
}

export const TaskActions = ({ children, id, projectId }: TaskActionsProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { mutate, isPending: isDeletingTask } = useDeleteTask();

  const [ConfirmDilalog, confirm] = useConfirmModal({
    message: "This action cannot be undone",
    title: "Delete Task",
    variant: "destructive",
  });

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate({ param: { taskId: id } });
  };

  const onOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
  };

  const { open } = useUpdateTaskModal();

  return (
    <div className="flex justify-end">
      <ConfirmDilalog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={onOpenTask}
            className="font-medium p-[10px]"
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            TaskDetails
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => open(id)}
            disabled={false}
            className="font-medium p-[10px]"
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onOpenProject}
            className="font-medium p-[10px]"
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isDeletingTask}
            className="font-medium p-[10px] text-red-600"
          >
            <Trash className="size-4 mr-2 stroke-2 text-red-600" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
