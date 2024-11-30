import { Loader } from "lucide-react";

import { Card, CardContent } from "@/app/_components/ui/card";

import { useGetMembersInWorkspace } from "../members/hooks/use-get-members-in-workspace";
import { useWorkspaceId } from "../workspace/hooks/useWorkspaceId";
import { UpdateTaskForm } from "./update-task-form ";
import { useGetTask } from "./hooks/use-get-task";
import { useGetWorkspacesInfo } from "../workspace/hooks/use-get-workspace-Info";
import { useCurrent } from "../auth/hooks/use-current";

interface UpdateTaskWrapperProps {
  onCancel: () => void;
  id: string;
}

export const UpdateTaskWrapper = ({ onCancel, id }: UpdateTaskWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const { data, status: TaskStatus } = useGetTask({
    taskId: id,
  });

  const { data: members } = useGetMembersInWorkspace({
    workspaceId,
  });

  const membersOptions = members?.data.map((member) => ({
    id: member.userId,
    name: member.name,
  }));
  const { data: session } = useCurrent();

  const { data: workspaceInfo } = useGetWorkspacesInfo({ workspaceId });

  if (!workspaceInfo || !workspaceInfo.data || !session) return;

  if (TaskStatus === "error") return "task Error";

  if (TaskStatus === "pending") {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const task = {
    name: data.data.tasksCollectionDocument.name,
    assigneeId: data.data.tasksCollectionDocument.assigneeId,
    dueDate: data.data.tasksCollectionDocument.dueDate,
    status: data.data.tasksCollectionDocument.status,
    email: data.data.usersCollectionDocument.email,
    workspaceId,
    workspaceName: workspaceInfo.data.name,
    id,
    isAdmin: workspaceInfo.data.userId === session.$id,
    description: data.data.tasksCollectionDocument.description,
    assigneeComment: data.data.tasksCollectionDocument.assigneeComment,
    reviewerComment: data.data.tasksCollectionDocument.reviewerComment,
    reviewerStatus: data.data.tasksCollectionDocument.reviewStatus,
  };
  return (
    <UpdateTaskForm
      onCancle={onCancel}
      memberOptions={membersOptions ?? []}
      task={task}
    />
  );
};
