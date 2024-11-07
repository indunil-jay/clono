"use client";
import { ResponsiveModal } from "../../_components/custom/responsive-modal";
import { CreateTaskFormWrapper } from "./create-task-form-wrapper";
import { useCreateTaskModal } from "./hooks/useCreateTaskModal";

export const CreateTaskModal = () => {
  const { isOpen, setOpen, close } = useCreateTaskModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setOpen}>
      <CreateTaskFormWrapper onCancel={close} />
    </ResponsiveModal>
  );
};
