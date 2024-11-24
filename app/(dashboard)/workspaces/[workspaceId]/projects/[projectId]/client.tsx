"use client";

import { DottedSeparator } from "@/app/_components/custom/dotted-separator";
import { Button } from "@/app/_components/ui/button";
import {
  CardHeader,
  Card,
  CardDescription,
  CardTitle,
} from "@/app/_components/ui/card";
import { ScrollArea, ScrollBar } from "@/app/_components/ui/scroll-area";
import { useGetProject } from "@/app/_features/projects/hooks/use-get-project";
import { useGetProjectsAnalitics } from "@/app/_features/projects/hooks/useGetProjetctAnalitics";
import { ProjectAvatar } from "@/app/_features/projects/project-avatar";
import { TaskViewSwitcher } from "@/app/_features/tasks/task-view-switcher";
import { cn } from "@/app/_lib/utils";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

export const ProjectClient = ({ projectId }: { projectId: string }) => {
  const { data, isPending } = useGetProject({ projectId });

  if (isPending) return "loading project";

  const project = data?.data!;
  return (
    <div className="flex flex-col gap-y-4 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            className="size-8"
          />
          <p>{project.name}</p>
        </div>

        <div>
          <Button variant={"secondary"} asChild size={"sm"}>
            <Link
              href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}
            >
              Edit Project
              <Pencil />
            </Link>
          </Button>
        </div>
      </div>

      {/* <ProjectAnalitics projectId={projectId} /> */}

      <TaskViewSwitcher />
    </div>
  );
};

export const ProjectAnalitics = ({ projectId }: { projectId: string }) => {
  const { data: analytics, isLoading } = useGetProjectsAnalitics({ projectId });

  if (!analytics) return null;

  if (isLoading) return <>loading</>;

  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row">
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
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

interface AnalyticsCardProps {
  title: string;
  value: number;
  variant: "up" | "down";
  increaseValue: number;
}

export const AnalyticsCard = ({
  increaseValue,
  title,
  value,
  variant,
}: AnalyticsCardProps) => {
  const iconColor = variant === "up" ? "text-emerald-500" : "text-red-500";
  const increaseValueColor =
    variant === "up" ? "text-emerald-500" : "text-red-500";

  const Icon = variant === "up" ? FaCaretUp : FaCaretDown;
  return (
    <Card className="shadow-none border-none w-full">
      <CardHeader>
        <div className="flex items-center gap-x-2.5">
          <CardDescription className="flex items-center gap-x-2 font-medium overflow-hidden">
            <span className="trucate text-base">{title}</span>
          </CardDescription>
          <div className="flex items-center gap-x-1">
            <Icon className={cn("size-4", iconColor)} />
            <span
              className={cn(
                increaseValueColor,
                "truncate text-base font-medium"
              )}
            >
              {increaseValue}
            </span>
          </div>
        </div>
        <CardTitle className="text-3xl font-semibold">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
};
