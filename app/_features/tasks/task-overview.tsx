"use client";
import { Button } from "@/app/_components/ui/button";
import { PencilIcon } from "lucide-react";
import { DottedSeparator } from "@/app/_components/custom/dotted-separator";
import { OverviewProperty } from "./overview-property";
import { MemberAvatar } from "../members/member-avatar";
import { TaskDate } from "./kanban/task-date";
import { Badge } from "@/app/_components/ui/badge";
import { snakeCaseToTitleCase } from "./utils";
import { useUpdateTaskModal } from "./hooks/use-update-task-modal";

interface TaskOverviewProps {
  task: any;
  name: string;
}

export const TaskOverview = ({ task, name }: TaskOverviewProps) => {
  const { open } = useUpdateTaskModal();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={() => open(task.$id)}
          >
            <PencilIcon className="size-4 mr-2" />
            Edit
          </Button>
        </div>
        <DottedSeparator className="mt-4" />
        <div className="flex flex-col gap-y-4">
          <OverviewProperty lable="Assignee">
            <MemberAvatar name={name} className="size-6" />
            <p className="text-sm font-medium">{name}</p>
          </OverviewProperty>
          <OverviewProperty lable="Due Date">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>
          <OverviewProperty lable="Status">
            <Badge>{snakeCaseToTitleCase(task.status)}</Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
};
