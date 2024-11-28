"use client";

import { Row } from "@tanstack/react-table";
import {  ExternalLinkIcon, MoreVertical, PencilIcon, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Button } from "@/app/_components/ui/button";
import { tableSchema } from "@/app/(dashboard)/workspaces/[workspaceId]/_components/schema";
import { useUpdateTaskModal } from "@/app/_features/tasks/hooks/use-update-task-modal";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/app/_features/workspace/hooks/useWorkspaceId";



interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = tableSchema.parse(row.original);

  const workspaceId  = useWorkspaceId()
  const { open } = useUpdateTaskModal();
  const router  = useRouter() 

  const onOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${task.id}`);
  };

  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${task.project}`);
  };


  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreVertical />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[160px]">

          

          <DropdownMenuItem
            onClick={onOpenTask}
            className="font-medium p-[10px]"
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            TaskDetails
          </DropdownMenuItem>

         
          <DropdownMenuItem
            onClick={onOpenProject}
            className="font-medium p-[10px]"
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Open Project
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => open(task.id)}
            disabled={false}
            className="font-medium p-[10px]"
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem
            // onClick={onDelete}
            // disabled={isDeletingTask}
            className="font-medium p-[10px] text-red-600"
          >
            <Trash className="size-4 mr-2 stroke-2 text-red-600" />
            Delete Task
          </DropdownMenuItem>
        {/* <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={task.label}>
              {labels.map((label) => (
                <DropdownMenuRadioItem key={label.value} value={label.value}>
                  {label.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  );
}
