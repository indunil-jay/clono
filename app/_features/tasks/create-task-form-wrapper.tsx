import { Card, CardContent } from "@/app/_components/ui/card";
import { useGetMembersInWorkspace } from "../members/hooks/use-get-members-in-workspace";
import { useGetProjectsByWorkspaceId } from "../projects/hooks/use-get-projetcts-by-workspace-id";
import { useWorkspaceId } from "../workspace/hooks/useWorkspaceId";
import { Loader } from "lucide-react";
import { CreateTaskForm } from "./create-task-form";

interface CreateTaskFormWrapperProps {
  onCancel: () => void;
}

export const CreateTaskFormWrapper = ({
  onCancel,
}: CreateTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId();

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
  const membersOptions = members?.data.map((member) => ({
    id: member.userId,
    name: member.name,
  }));
  const isLoading = isLoadingMembers || isLoadingProjects;

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
    <CreateTaskForm
      onCancle={onCancel}
      projectOptions={projectsOptions ?? []}
      memberOptions={membersOptions ?? []}
    />
  );
};
