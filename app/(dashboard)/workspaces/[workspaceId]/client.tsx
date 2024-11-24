"use client";

import { ScrollArea, ScrollBar } from "@/app/_components/ui/scroll-area";
import { useGetTasks } from "@/app/_features/tasks/hooks/use-get-tasks";
import { AnalyticsCard } from "./projects/[projectId]/client";
import { DottedSeparator } from "@/app/_components/custom/dotted-separator";
import { DataTable } from "@/app/_features/tasks/data-table";
import { columns } from "@/app/_features/tasks/columns";
import { PageLoader } from "@/app/_features/tasks/pag-loader";
import { DataFilters } from "@/app/_features/tasks/data-filters";
import { useGetWorkspaceAnalyitics } from "@/app/_features/workspace/hooks/useGetWorkspaceAnalyitics";
import { useGetProjectsByWorkspaceId } from "@/app/_features/projects/hooks/use-get-projetcts-by-workspace-id";
import { useGetMembersInWorkspace } from "@/app/_features/members/hooks/use-get-members-in-workspace";
import { SpinnerCircle } from "@/app/_components/custom/spinner-circle";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";

export const WorkspaceIdClient = ({ workspaceId }: { workspaceId: string }) => {
  const { data: tasks, status } = useGetTasks({
    workspaceId,
  });

  const { data: analytics, status: analticsStatus } = useGetWorkspaceAnalyitics(
    {
      workspaceId,
    }
  );

  const { data: projects, status: projectStatus } = useGetProjectsByWorkspaceId(
    {
      workspaceId,
    }
  );

  const { data: members, isLoading: isLoadingMembers } =
    useGetMembersInWorkspace({
      workspaceId,
    });

  if (status === "pending") return <PageLoader />;
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
          <DataFilters />
        </CardHeader>
        <CardContent>
          <DataTable
            key={"all-tasks-table"}
            columns={columns}
            data={tasks?.data! ?? []}
          />
        </CardContent>
      </Card>
    </div>
  );
};
