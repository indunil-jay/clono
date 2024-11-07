"use client";
import { DottedSeparator } from "@/app/_components/custom/dotted-separator";
import { Button } from "@/app/_components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";
import { Loader, PlusCircle } from "lucide-react";
import { useCreateTaskModal } from "./hooks/useCreateTaskModal";
import { useGetTasks } from "./hooks/useGetTasks";
import { useWorkspaceId } from "../workspace/hooks/useWorkspaceId";
import { useQueryState } from "nuqs";
import { DataFilters } from "./data-filters";
import { useTaskFilters } from "./hooks/useTaskFilters";

export const TaskViewSwitcher = () => {
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });
  const [{ status, search, assigneeId, projectId, dueDate }, setFilters] =
    useTaskFilters();
  const { open } = useCreateTaskModal();
  const workspaceId = useWorkspaceId();
  const { data: tasks, isPending: isLoadingTask } = useGetTasks({
    workspaceId,
    status,
    search,
    assigneeId,
    projectId,
    dueDate,
  });

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
        <DataFilters />
        <DottedSeparator className="mt-4" />
        {isLoadingTask ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center  justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              {JSON.stringify(tasks)}
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              {JSON.stringify(tasks)}
            </TabsContent>
            <TabsContent value="calendar" className="mt-0">
              {JSON.stringify(tasks)}
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
