"use client";

import { useTaskId } from "@/app/_features/tasks/hooks/use-taskId";
import { useGetTasksById } from "@/app/_features/tasks/hooks/useGetTaskById";
import { PageError } from "@/app/_features/tasks/pag-error";
import { PageLoader } from "@/app/_features/tasks/pag-loader";
import { TaskBreadcrumbs } from "@/app/_features/tasks/task-breadcrumbs";

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
    </div>
  );
};
