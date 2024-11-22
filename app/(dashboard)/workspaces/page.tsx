"use client";

import { ScrollArea, ScrollBar } from "@/app/_components/ui/scroll-area";
import { AnalyticsCard } from "./_components/analytics-card";
import { DottedSeparator } from "@/app/_components/custom/dotted-separator";
import { useGetWorkspacesAnalyitics } from "@/app/_features/workspace/hooks/use-get-workspaces-analytics";

export default function Page() {
  const { data, status } = useGetWorkspacesAnalyitics();

  if (status === "error") return "error";

  if (status === "pending") return "loading";

  return (
    <div className="h-full flex flex-col space-y-4">
      <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
        <div className="w-full flex flex-row">
          <div className="flex items-center flex-1">
            <AnalyticsCard
              title="Total tasks"
              value={6}
              variant={5 > 0 ? "up" : "down"}
              increaseValue={3}
            />
            {data.data.adminWorkspacesTotal}
            {data.data.lastMonthAdminWorkspacesTotal}
            {data.data.thisMonthAdminWorkspacesTotal}

            <DottedSeparator direction="vertical" />
          </div>

          {/* <div className="flex items-center flex-1">
           <AnalyticsCard
             title="Assigned Tasks"
             value={analytics.data.assignedTaskCount}
             variant={analytics.data.assignedTaskDifference > 0 ? "up" : "down"}
             increaseValue={analytics.data.assignedTaskDifference}
           />
           <DottedSeparator direction="vertical" />
         </div>
         <div className="flex items-center flex-1">
           <AnalyticsCard
             title="completed Tasks"
             value={analytics.data.completeTaskCount}
             variant={analytics.data.completeTaskDifference > 0 ? "up" : "down"}
             increaseValue={analytics.data.completeTaskDifference}
           />
           <DottedSeparator direction="vertical" />
         </div>
         <div className="flex items-center flex-1">
           <AnalyticsCard
             title="overdue Tasks"
             value={analytics.data.overDueTaskCount}
             variant={analytics.data.overDueTaskDifference > 0 ? "up" : "down"}
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
         </div> */}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* <TaskList tasks={tasks.documents} total={tasks.total} />
       <ProjectList
         projects={projects.data.documents}
         total={projects.data.total}
       />
       <MembersList members={members.data.documents} total={4} /> */}
      </div>
    </div>
  );
}
