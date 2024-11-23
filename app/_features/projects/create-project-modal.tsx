"use client";
import { ResponsiveModal } from "../../_components/custom/responsive-modal";
import { CreateProjectForm } from "./create-project-form";
import { useCreateProjectModal } from "./hooks/use-create-project-modal";

export const CreateProjecteModal = () => {
  const { isOpen, setOpen, close } = useCreateProjectModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setOpen}>
      <CreateProjectForm onCancle={close} />
    </ResponsiveModal>
  );
};
