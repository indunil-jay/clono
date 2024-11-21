"use client";

import { ResponsiveModal } from "@/app/_components/custom/responsive-modal";
import { CreateWorkspaceForm } from "@/app/_features/workspace/create-workspace-form";
import { useCreateWorkspaceModal } from "@/app/_features/workspace/hooks/use-create-workspace-modal";

export const CreateWorkSpaceModal = () => {
  const { isOpen, setOpen, close } = useCreateWorkspaceModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setOpen}>
      <CreateWorkspaceForm onCancle={close} />
    </ResponsiveModal>
  );
};
