import { Card, CardContent } from "@/app/_components/ui/card";
import { useGetMembersInWorkspace } from "../members/hooks/use-get-members-in-workspace";
import { useGetProjectsByWorkspaceId } from "../projects/hooks/use-get-projetcts-by-workspace-id";
import { useWorkspaceId } from "../workspace/hooks/useWorkspaceId";
import { Loader } from "lucide-react";
import { useGetTasksById } from "./hooks/use-get-task";
import { UpdateTaskForm } from "./update-task-form ";

interface UpdateTaskWrapperProps {
  onCancel: () => void;
  id: string;
}

export const UpdateTaskWrapper = ({ onCancel, id }: UpdateTaskWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const { data: task, isLoading: isTaskLoading } = useGetTasksById({
    taskId: id,
  });

  const { data: projects, isLoading: isLoadingProjects } =
    useGetProjectsByWorkspaceId({
      workspaceId,
    });
  const { data: members, isLoading: isLoadingMembers } =
    useGetMembersInWorkspace({
      workspaceId,
    });

  const projectsOptions = projects?.data?.workspaceAllProjects.map(
    (project) => ({
      id: project.$id,
      name: project.name,
      imageUrl: project.imageUrl,
    })
  );
  const membersOptions = members?.data.map((project) => ({
    id: project.$id,
    name: project.name,
  }));

  const isLoading = isLoadingMembers || isLoadingProjects || isTaskLoading;
  if (!task) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <UpdateTaskForm
      onCancle={onCancel}
      projectOptions={projectsOptions ?? []}
      memberOptions={membersOptions ?? []}
      task={task.data}
    />
  );
};
