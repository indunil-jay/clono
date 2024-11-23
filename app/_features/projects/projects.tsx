"use client";

import { RiAddCircleFill } from "react-icons/ri";
import { useWorkspaceId } from "../workspace/hooks/useWorkspaceId";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/_lib/utils";
import { useCreateProjectModal } from "./hooks/use-create-project-modal";
import { ProjectAvatar } from "./project-avatar";
import { useGetProjectsByWorkspaceId } from "./hooks/use-get-projetcts-by-workspace-id";
import { SpinnerCircle } from "@/app/_components/custom/spinner-circle";

export const Projects = () => {
  const workspaceId = useWorkspaceId();
  const { data, status } = useGetProjectsByWorkspaceId({ workspaceId });
  const pathname = usePathname();
  const { open } = useCreateProjectModal();

  if (status === "pending") return <SpinnerCircle />;
  if (status === "error") return "error";

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="uppercase text-xs text-neutral-500 font-semibold">
          Projects
        </p>
        <RiAddCircleFill
          className="text-neutral-500 cursor-pointer size-5 transition hover:text-neutral-700 "
          onClick={() => open()}
        />
      </div>

      {data.data?.workspaceAllProjects.map((project) => {
        const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
        const isActive = pathname === href;

        return (
          <Link href={href} key={project.$id}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
                isActive && "bg-white shadow-md hover:opacity-100 text-primary"
              )}
            >
              <ProjectAvatar image={project.imageUrl} name={project.name} />
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
