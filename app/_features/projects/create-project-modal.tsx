"use client";
import { ResponsiveModal } from "@/app/_components/custom/responsive-modal";
import { CreateProjectForm } from "@/app/_features/projects/create-project-form";
import { useCreateProjectModal } from "@/app/_features/projects/hooks/use-create-project-modal";

export const CreateProjecteModal = () => {
  const { isOpen, setOpen, close } = useCreateProjectModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setOpen}>
      <CreateProjectForm onCancle={close} />
    </ResponsiveModal>
  );
};
