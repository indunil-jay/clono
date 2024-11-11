"use client";

import { DottedSeparator } from "@/app/_components/custom/dotted-separator";
import { useTaskId } from "@/app/_features/tasks/hooks/use-taskId";
import { useGetTasksById } from "@/app/_features/tasks/hooks/useGetTaskById";
import { PageError } from "@/app/_features/tasks/pag-error";
import { PageLoader } from "@/app/_features/tasks/pag-loader";
import { TaskBreadcrumbs } from "@/app/_features/tasks/task-breadcrumbs";
import { TaskDescription } from "@/app/_features/tasks/task-description";
import { TaskOverview } from "@/app/_features/tasks/task-overview";

export const TaskIdClient = () => {
  const taskId = useTaskId();
  const { data, isLoading } = useGetTasksById({ taskId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return <PageError message="Task not found" />;
  }
  return (
    <div className="flex flex-col">
      <TaskBreadcrumbs project={data.data.project} task={data.data} />
      <DottedSeparator className="my-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={data.data} />
        <TaskDescription task={data.data} />
      </div>
    </div>
  );
};
