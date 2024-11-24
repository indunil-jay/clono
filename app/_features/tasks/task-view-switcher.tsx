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
import { useCreateTaskModal } from "./hooks/use-create-task-modal";
import { useGetTasks } from "./hooks/use-get-tasks";
import { useWorkspaceId } from "../workspace/hooks/useWorkspaceId";
import { useQueryState } from "nuqs";
import { DataFilters } from "./data-filters";
import { useTaskFilters } from "./hooks/useTaskFilters";
import { DataTable } from "./data-table";
import { columns, TaskTableColums } from "./columns";
import { DataKanban } from "./data-kanban";
import { useCallback } from "react";
import { TaskStatus } from "./types";
import { useUpdateBulkTasks } from "./hooks/useUpdatebulkTasks";
import { DataCalendar } from "./data-calendar";
import "./data-calendar.css";
import { SpinnerCircle } from "@/app/_components/custom/spinner-circle";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
}

// export const sampleTaskTableData: TaskTableColums[] = [
//   {
//     id: "1",
//     name: "Design homepage",
//     project: {
//       name: "Website Redesign",
//       imageUrl: "https://via.placeholder.com/150",
//       projectId: "1",
//     },
//     assignee: {
//       name: "Alice Johnson",
//       email: "alice.johnson@example.com",
//     },
//     dueDate: "2024-12-01",
//     status: "in progress",
//   },
//   {
//     id: "2",
//     name: "Develop login feature",
//     project: {
//       name: "Mobile App",
//       imageUrl: "https://via.placeholder.com/150",
//       projectId: "1",
//     },
//     assignee: {
//       name: "Bob Smith",
//       email: "bob.smith@example.com",
//     },
//     dueDate: "2024-12-05",
//     status: "todo",
//   },
//   {
//     id: "3",
//     name: "Prepare project report",
//     project: {
//       name: "Quarterly Review",
//       imageUrl: "https://via.placeholder.com/150",
//       projectId: "1",
//     },
//     assignee: {
//       name: "Charlie Davis",
//       email: "charlie.davis@example.com",
//     },
//     dueDate: "2024-11-28",
//     status: "in review",
//   },
//   {
//     id: "4",
//     name: "Fix authentication bug",
//     project: {
//       name: "Backend Maintenance",
//       imageUrl: "https://via.placeholder.com/150",
//       projectId: "1",
//     },
//     assignee: {
//       name: "Diana Torres",
//       email: "diana.torres@example.com",
//     },
//     dueDate: "2024-11-30",
//     status: "done",
//   },
//   {
//     id: "5",
//     name: "Create onboarding documentation",
//     project: {
//       name: "HR System",
//       imageUrl: "https://via.placeholder.com/150",
//       projectId: "1",
//     },
//     assignee: {
//       name: "Ethan Brown",
//       email: "ethan.brown@example.com",
//     },
//     dueDate: "2024-12-03",
//     status: "todo",
//   },
// ];

export const TaskViewSwitcher = ({
  hideProjectFilter,
}: TaskViewSwitcherProps) => {
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });
  const [{ status, search, assigneeId, projectId, dueDate }, setFilters] =
    useTaskFilters();

  const { open } = useCreateTaskModal();

  const workspaceId = useWorkspaceId();

  const {
    data: tasks,
    isLoading,
    isError,
  } = useGetTasks({
    workspaceId,
    status,
    search,
    assigneeId,
    projectId,
    dueDate,
  });

  const { mutate } = useUpdateBulkTasks();
  const onKanbanChange = useCallback(
    (tasks: { $id: string; status: TaskStatus; position: number }[]) => {
      mutate({ json: { tasks } });
    },
    [mutate]
  );

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
              <DataTable columns={columns} data={tasks?.data! ?? []} />
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
