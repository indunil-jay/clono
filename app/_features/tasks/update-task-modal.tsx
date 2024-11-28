"use client";
import { ResponsiveModal } from "@/app/_components/custom/responsive-modal";
import { UpdateTaskWrapper } from "@/app/_features/tasks/update-task-form-wrapper";
import { useUpdateTaskModal } from "@/app/_features/tasks/hooks/use-update-task-modal";

export const UpdeteTaskModal = () => {
  const { close, taskId } = useUpdateTaskModal();
  return (
    <ResponsiveModal open={!!taskId} onOpenChange={close}>
      {taskId && <UpdateTaskWrapper id={taskId} onCancel={close} />}
    </ResponsiveModal>
  );
};
