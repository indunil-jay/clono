"use client";
import Link from "next/link";
import { ProjectAvatar } from "../projects/project-avatar";
import { useWorkspaceId } from "../workspace/hooks/useWorkspaceId";
import { ChevronRightIcon, TrashIcon } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { useDeleteTask } from "./hooks/use-delete-task";
import { useConfirmModal } from "@/app/_components/custom/use-confirm-modal";
import { useRouter } from "next/navigation";



export const TaskBreadcrumbs = ({ project, task }: any) => {
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useDeleteTask();
  const router = useRouter();
  const [ConfirmDialog, confirm] = useConfirmModal({
    message: "This action cannot be undone.",
    title: "Delete Task",
    variant: "destructive",
  });
  const handleDeleteTask = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate(
      { param: { taskId: task.$id } },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}/tasks`);
        },
      }
    );
  };
  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog />
      <ProjectAvatar
        name={project.name}
        image={project.imageUrl}
        className="size-6 lg:size-8"
      />

      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
          {project.name}
        </p>
      </Link>
      <ChevronRightIcon className="size-4 lg:size-5 text-muted-foreground" />
      <p className="text-sm lg:text-lg font-semibold">{task.name}</p>
      <Button
        onClick={handleDeleteTask}
        size="sm"
        className="ml-auto"
        variant={"destructive"}
        disabled={isPending}
      >
        <TrashIcon className="size-4 lg:mr-2" />
        <span className="hidden lg:block">Delete Task</span>
      </Button>
    </div>
  );
};
