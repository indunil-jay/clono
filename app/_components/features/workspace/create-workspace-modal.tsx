"use client";
import { ResponsiveModal } from "../../custom/responsive-modal";
import { CreateWorkspaceForm } from "./create-workspace-form";
import { useCreateWorkspaceModal } from "./hooks/useCreateWorkSpaceModal";

export const CreateWorkSpaceModal = () => {
  const { isOpen, setOpen, close } = useCreateWorkspaceModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setOpen}>
      <CreateWorkspaceForm onCancle={close} />
    </ResponsiveModal>
  );
};
