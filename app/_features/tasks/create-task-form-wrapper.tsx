import { Card, CardContent } from "@/app/_components/ui/card";
import { useGetMembers } from "../members/hooks/useGetMember";
import { useGetProjects } from "../projects/hooks/useGetProjetct";
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
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const projectsOptions = projects?.data.documents.map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));
  const membersOptions = members?.data.documents.map((project) => ({
    id: project.$id,
    name: project.name,
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
