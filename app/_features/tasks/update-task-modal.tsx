"use client";
import { ResponsiveModal } from "../../_components/custom/responsive-modal";
import { UpdateTaskWrapper } from "./update-task-form-wrapper";
import { useUpdateTaskModal } from "./hooks/useUpdateTaskModal";

export const UpdeteTaskModal = () => {
  const { close, taskId } = useUpdateTaskModal();
  return (
    <ResponsiveModal open={!!taskId} onOpenChange={close}>
      {taskId && <UpdateTaskWrapper id={taskId} onCancel={close} />}
    </ResponsiveModal>
  );
};
