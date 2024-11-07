"use client";

import { RiAddCircleFill } from "react-icons/ri";
import { useGetProjects } from "./hooks/useGetProjetct";
import { useWorkspaceId } from "../workspace/hooks/useWorkspaceId";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/_lib/utils";
import { useCreateProjectModal } from "./hooks/useCreateProjectModal";
import { ProjectAvatar } from "./project-avatar";

export const Projects = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetProjects({ workspaceId });
  const pathname = usePathname();
  const { open } = useCreateProjectModal();
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

      {data?.data.documents.map((project) => {
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
