"use client";
import { Loader, PlusCircle } from "lucide-react";
import { useQueryState } from "nuqs";

import { DottedSeparator } from "@/app/_components/custom/dotted-separator";
import { Button } from "@/app/_components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";
import { DataFilters } from "./data-filters";

import { useCreateTaskModal } from "./hooks/use-create-task-modal";
import { useGetTasks } from "./hooks/use-get-tasks";
import { useTaskFilters } from "./hooks/use-task-filters";
import "./calendar/data-calendar.css";
import { DataTable } from "@/app/(dashboard)/workspaces/[workspaceId]/_components/data-table";
import { columns } from "@/app/(dashboard)/workspaces/[workspaceId]/_components/columns";

interface TaskViewSwitcherProps {
  workspaceId:string;
  hideProjectFilter?: boolean;
  projectId?:string
}

export const TaskViewSwitcher = ({
  hideProjectFilter,workspaceId,projectId
}: TaskViewSwitcherProps) => {

  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });

  const [{ status, search, assigneeId, projectId:queryProjectId, dueDate }, ] =
    useTaskFilters();
    
    const {
    data: tasks,
    isLoading,
    isError,
  } = useGetTasks({
    workspaceId,
    status,
    search,
    assigneeId,
    projectId:projectId || queryProjectId,
    dueDate,
  });

    const { open } = useCreateTaskModal();

  // const { mutate } = useUpdateBulkTasks();

  // const onKanbanChange = useCallback(
  //   (tasks: { $id: string; status: TaskStatus; position: number }[]) => {
  //     mutate({ json: { tasks } });
  //   },
  //   [mutate]
  // );

  

  if (isError) return "Error task list loading";

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="flex-1 w-full border rounded-lg"
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calender
            </TabsTrigger>
          </TabsList>

          <Button onClick={open}>
            <PlusCircle className="size-4 mr-2" />
            New
          </Button>
        </div>
        <DottedSeparator className="mt-4" />

        {/* add filters */}
        <DataFilters hideProjectFilter={hideProjectFilter} />

        <DottedSeparator className="mt-4" />
        {isLoading ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center  justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.data ?? []} />
            </TabsContent>

            {/* <TabsContent value="kanban" className="mt-0">
              <DataKanban onChange={onKanbanChange} data={tasks?.data! ?? []} />
            </TabsContent>
            <TabsContent value="calendar" className="mt-0 pb-4">
              <DataCalendar data={tasks?.data! ?? []} />
            </TabsContent> */}
          </>
        )}
      </div>
    </Tabs>
  );
};
