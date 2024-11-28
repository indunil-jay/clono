"use client";

import { DottedSeparator } from "@/app/_components/custom/dotted-separator";
import { useTaskId } from "@/app/_features/tasks/hooks/use-taskId";
import { useGetTasksById } from "@/app/_features/tasks/hooks/use-get-task";
import { TaskDescription } from "@/app/_features/tasks/task-description";
import { TaskOverview } from "@/app/_features/tasks/task-overview";

export const TaskIdClient = () => {
  const taskId = useTaskId();
  const { data, status, error } = useGetTasksById({ taskId });

  if (status === "pending") {
    return "loading";
  }

  if (status === "error") {
    return <span>{error.message}</span>;
  }

  return (
    <div className="flex flex-col">
      {/* <TaskBreadcrumbs project={data.data.projectsCollectionDocumen} task={data.data.tasksCollectionDocument} /> */}
      <DottedSeparator className="my-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview
          task={data.data.tasksCollectionDocument}
          name={data.data.usersCollectionDocument.name}
        />
        <TaskDescription task={data.data.tasksCollectionDocument} />
      </div>
    </div>
  );
};
