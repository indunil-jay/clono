"use client";
import { DottedSeparator } from "@/app/_components/custom/dotted-separator";
import { AssigneeDetails } from "./assignee-details";
import { DescriptionCard } from "./description-card";
import { useGetTask } from "@/app/_features/tasks/hooks/use-get-task";
import { useGetWorkspacesInfo } from "@/app/_features/workspace/hooks/use-get-workspace-Info";

interface UpdateAssigneeFormProps {
  taskId: string;
  workspaceId: string;
}

export const UpdateAssigneeForm = ({
  taskId,
  workspaceId,
}: UpdateAssigneeFormProps) => {
  const { data } = useGetTask({ taskId });
  const { data: workspaceInfo } = useGetWorkspacesInfo({ workspaceId });

  if (!data || !workspaceInfo || !workspaceInfo.data) return;

  const isAdmin =
    workspaceInfo.data.userId === data.data.tasksCollectionDocument.assigneeId;

  const description = data.data.tasksCollectionDocument.description;
  const assigneeComment = data.data.tasksCollectionDocument.assigneeComment;
  const reviewerComment = data.data.tasksCollectionDocument.reviewerComment;
  const reviewerStatus = data.data.tasksCollectionDocument.reviewStatus;

  const task = {
    assigneeId: data.data.tasksCollectionDocument.assigneeId,
    status: data.data.tasksCollectionDocument.status,
    email: data.data.usersCollectionDocument.email,
    workspaceId,
    workspaceName: workspaceInfo.data.name,
    isAdmin,
  };
  return (
    <>
      <AssigneeDetails task={task} workspaceId={workspaceId} />
      <DottedSeparator className="my-5" />
      <DescriptionCard
        title="Task Details"
        label="Provide a detailed description of the task for the assignee."
        readOnly={isAdmin}
        fieldKey="description"
        defaultValue={description}
      />
      <DottedSeparator className="my-5" />
      <DescriptionCard
        title="Assignee Comments"
        label="Share your insights or updates on the task."
        readOnly={true}
        fieldKey="userComment"
        defaultValue={assigneeComment}
      />
      <DottedSeparator className="my-5" />
      <DescriptionCard
        title="Reviewer Feedback"
        label="Add your thoughts or suggestions regarding the task."
        readOnly={isAdmin}
        fieldKey="reviewerComment"
        defaultValue={reviewerComment}
        obj={reviewerStatus}
      />
    </>
  );
};
