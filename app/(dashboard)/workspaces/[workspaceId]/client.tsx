"use client";

import { ScrollArea, ScrollBar } from "@/app/_components/ui/scroll-area";
import { useGetMembers } from "@/app/_features/members/hooks/useGetMember";
import { useCreateProjectModal } from "@/app/_features/projects/hooks/useCreateProjectModal";
import { useGetProjects } from "@/app/_features/projects/hooks/useGetProjetct";
import { useCreateTaskModal } from "@/app/_features/tasks/hooks/useCreateTaskModal";
import { useGetTasks } from "@/app/_features/tasks/hooks/useGetTasks";
import { PageError } from "@/app/_features/tasks/pag-error";
import { PageLoader } from "@/app/_features/tasks/pag-loader";
import { useGetWorkspaceAnalyitics } from "@/app/_features/workspace/hooks/useGetWorkspaceAnalyitics";
import { AnalyticsCard } from "./projects/[projectId]/client";
import { DottedSeparator } from "@/app/_components/custom/dotted-separator";
import { Task } from "@/app/_features/tasks/types";
import { Button } from "@/app/_components/ui/button";
import { CalendarIcon, PlusIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { useWorkspaceId } from "@/app/_features/workspace/hooks/useWorkspaceId";
import { Card, CardContent } from "@/app/_components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Project } from "@/app/_features/projects/types";
import { ProjectAvatar } from "@/app/_features/projects/project-avatar";
import { Member } from "@/app/_features/members/types";
import { MemberAvatar } from "@/app/_features/members/components/member-avatar";

export const WorkspaceIdClient = ({ workspaceId }: { workspaceId: string }) => {
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetWorkspaceAnalyitics({
      workspaceId,
    });
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
  });

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });

  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading =
    isLoadingAnalytics ||
    isLoadingTasks ||
    isLoadingProjects ||
    isLoadingMembers;

  if (!isLoading) return <PageLoader />;

  if (!analytics || !tasks || !projects || !members) {
    return <PageError message="failed to load workspace data" />;
  }

  return (
    <div className="h-full flex flex-col space-y-4">
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TaskList tasks={tasks.documents} total={tasks.total} />
        <ProjectList
          projects={projects.data.documents}
          total={projects.data.total}
        />
        <MembersList members={members.data.documents} total={4} />
      </div>
    </div>
  );
};

interface TaskListprops {
  tasks: Task[];
  total: number;
}

export const TaskList = ({ tasks, total }: TaskListprops) => {
  const { open: createTask } = useCreateTaskModal();
  const workspaceId = useWorkspaceId();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Task ({total})</p>
          <Button variant={"secondary"} size="icon" onClick={createTask}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />

        <ul className="flex flex-col gap-y-4">
          {tasks.map((task) => (
            <Link
              key={task.$id}
              href={`/workspaces/${workspaceId}/tasks/${task.$id}`}
            >
              <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                <CardContent className="p-4">
                  <p className="text-lg font-medium truncate">{task.name}</p>
                  <div className="flex items-center gap-x-2">
                    <p>{task.project?.name}</p>
                    <div className="size-1 rounded-full bg-neutral-300" />
                    <div className="text-sm text-muted-foreground flex items-center">
                      <CalendarIcon className="size-3 mr-1" />
                      <span className="truncate">
                        {formatDistanceToNow(new Date(task.dueDate))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No tasks found
          </li>
        </ul>
        <Button asChild variant={"secondary"} className="mt-4 w-full">
          <Link href={`/workspaces/${workspaceId}/tasks`}>show all</Link>
        </Button>
      </div>
    </div>
  );
};

interface ProjectListprops {
  projects: Project[];
  total: number;
}
export const ProjectList = ({ projects, total }: ProjectListprops) => {
  const { open: createProject } = useCreateProjectModal();
  const workspaceId = useWorkspaceId();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects ({total})</p>
          <Button variant={"secondary"} size="icon" onClick={createProject}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />

        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((project) => (
            <Link
              key={project.$id}
              href={`/workspaces/${workspaceId}/projects/${project.$id}`}
            >
              <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                <CardContent className="p-4 flex items-center gap-x-2.5">
                  <ProjectAvatar
                    name={project.name}
                    className="size-12"
                    fallbackClassName="text-lg"
                    image={project.imageUrl}
                  />
                  <p className="text-lg font-medium truncate">{project.name}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No projects found
          </li>
        </ul>
      </div>
    </div>
  );
};

interface MembersListProps {
  members: Member[];
  total: number;
}
export const MembersList = ({ members, total }: MembersListProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members ({total})</p>
          <Button asChild variant={"secondary"} size="icon">
            <Link href={`/workspaces/${workspaceId}/member`}>
              <SettingsIcon className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <DottedSeparator className="my-4" />

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <Card
              key={member.$id}
              className="shadow-none rounded-lg overflow-hidden"
            >
              <CardContent className="p-3 flex flex-col items-center gap-x-2.5">
                <MemberAvatar name={member.name} className="size-12" />
                <div className="flex flex-col items-center overflow-hidden">
                  <p className="text-lg font-medium line-clamp-1">
                    {member.name}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {member.email}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No projects Members
          </li>
        </ul>
      </div>
    </div>
  );
};
