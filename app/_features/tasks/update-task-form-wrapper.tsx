import { Loader } from "lucide-react";

import { Card, CardContent } from "@/app/_components/ui/card";

import { useGetMembersInWorkspace } from "../members/hooks/use-get-members-in-workspace";
import { useWorkspaceId } from "../workspace/hooks/useWorkspaceId";
import { UpdateTaskForm } from "./update-task-form ";
import { useGetTask } from "./hooks/use-get-task";

interface UpdateTaskWrapperProps {
  onCancel: () => void;
  id: string;
}

export const UpdateTaskWrapper = ({ onCancel, id }: UpdateTaskWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const { data: task, status: TaskStatus } = useGetTask({
    taskId: id,
  });

  const { data: members } = useGetMembersInWorkspace({
    workspaceId,
  });

  const membersOptions = members?.data.map((member) => ({
    id: member.userId,
    name: member.name,
  }));

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

  const taskData = {
    id: task.data.tasksCollectionDocument.$id,
    name: task.data.tasksCollectionDocument.name,
    dueDate: task.data.tasksCollectionDocument.dueDate,
    status: task.data.tasksCollectionDocument.status,
    description: task.data.tasksCollectionDocument.description,
    assigneeId: task.data.tasksCollectionDocument.assigneeId,
    projectId: task.data.tasksCollectionDocument.projectId,
  };
  return (
    <UpdateTaskForm
      onCancle={onCancel}
      memberOptions={membersOptions ?? []}
      task={taskData}
    />
  );
};
