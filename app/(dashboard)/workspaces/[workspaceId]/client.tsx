"use client";

import { useGetTasks } from "@/app/_features/tasks/hooks/use-get-tasks";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { DataFilter } from "./_components/data-filter";
import { Spinner } from "@/app/_components/custom/spinner";

// import { DataTable } from "@/app/_features/tasks/table/data-table";
// import { DataFilters } from "@/app/_features/tasks/data-filters";
// import { columns } from "@/app/_features/tasks/table/columns";

export const WorkspaceIdClient = ({ workspaceId }: { workspaceId: string }) => {
  console.log(workspaceId);

  const { data: tasks, status } = useGetTasks({
    workspaceId,
  });

  // const { data: analytics, status: analticsStatus } = useGetWorkspaceAnalyitics(
  //   {
  //     workspaceId,
  //   }
  // );

  // const { data: projects, status: projectStatus } = useGetProjectsByWorkspaceId(
  //   {
  //     workspaceId,
  //   }
  // );

  // const { data: members, isLoading: isLoadingMembers } =
  //   useGetMembersInWorkspace({
  //     workspaceId,
  //   });

  if (status === "pending") return <Spinner />;
  if (status === "error") return "error in all task list";

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
        <div className="w-full flex flex-row">
          {analticsStatus === "pending" && <SpinnerCircle />}
          {analticsStatus === "success" && (
            <>
              <div className="flex items-center flex-1">
                <AnalyticsCard
                  title="total tasks"
                  value={analytics.data.taskCount}
                  variant={analytics.data.taskDifference > 0 ? "up" : "down"}
                  increaseValue={analytics.data.taskDifference}
                />
                <DottedSeparator direction="vertical" />
              </div>

              <div className="flex items-center flex-1">
                <AnalyticsCard
                  title="Assigned Tasks"
                  value={analytics.data.assignedTaskCount}
                  variant={
                    analytics.data.assignedTaskDifference > 0 ? "up" : "down"
                  }
                  increaseValue={analytics.data.assignedTaskDifference}
                />
                <DottedSeparator direction="vertical" />
              </div>
              <div className="flex items-center flex-1">
                <AnalyticsCard
                  title="completed Tasks"
                  value={analytics.data.completeTaskCount}
                  variant={
                    analytics.data.completeTaskDifference > 0 ? "up" : "down"
                  }
                  increaseValue={analytics.data.completeTaskDifference}
                />
                <DottedSeparator direction="vertical" />
              </div>
              <div className="flex items-center flex-1">
                <AnalyticsCard
                  title="overdue Tasks"
                  value={analytics.data.overDueTaskCount}
                  variant={
                    analytics.data.overDueTaskDifference > 0 ? "up" : "down"
                  }
                  increaseValue={analytics.data.overDueTaskDifference}
                />
                <DottedSeparator direction="vertical" />
              </div>
              <div className="flex items-center flex-1">
                <AnalyticsCard
                  title="Incompleted Tasks"
                  value={analytics.data.incompleteTaskCount}
                  variant={
                    analytics.data.incompleteTaskDifference > 0 ? "up" : "down"
                  }
                  increaseValue={analytics.data.incompleteTaskDifference}
                />
                <DottedSeparator direction="vertical" />
              </div>
            </>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea> */}

      <Card>
        <CardHeader>
          <DataFilter />
        </CardHeader>
        <CardContent>
          <DataTable data={tasks.data ?? []} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
};
