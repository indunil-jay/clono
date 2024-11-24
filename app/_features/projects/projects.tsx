"use client";

import { RiAddCircleFill } from "react-icons/ri";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/app/_lib/utils";
import { ProjectAvatar } from "@/app/_features/projects/project-avatar";
import { SpinnerCircle } from "@/app/_components/custom/spinner-circle";

import { useCreateProjectModal } from "@/app/_features/projects/hooks/use-create-project-modal";
import { useGetProjectsByWorkspaceId } from "@/app/_features/projects/hooks/use-get-projetcts-by-workspace-id";
import { useWorkspaceId } from "../workspace/hooks/useWorkspaceId";
import { ProjectsCollectionDocument } from "@/src/entities/project.entity";

export const Projects = () => {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();

  const { data, status } = useGetProjectsByWorkspaceId({ workspaceId });
  const { open } = useCreateProjectModal();

  if (status === "pending") return <SpinnerCircle />;
  if (status === "error") return "error";

  return (
    <div className="flex flex-col">
      <div className="flex items-center my-2 justify-between">
        <p className="uppercase text-xs text-neutral-500 font-semibold">
          Projects
        </p>
        <RiAddCircleFill
          className="text-neutral-500 cursor-pointer size-5 transition hover:text-neutral-700 "
          onClick={() => open()}
        />
      </div>

      <div className="gap-y-1 flex flex-col">
        {data.data?.workspaceAllProjects.map(
          (project: ProjectsCollectionDocument) => {
            const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
            const isActive = pathname === href;

            return (
              <Link href={href} key={project.$id} className="">
                <div
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-600",
                    "hover:bg-neutral-50 hover:shadow-sm hover:opacity-100 hover:text-primary hover:scale-[1.0075]",
                    isActive &&
                      "bg-neutral-50 shadow-sm hover:opacity-100 text-primary"
                  )}
                >
                  <ProjectAvatar image={project.imageUrl} name={project.name} />

                  <span className="truncate text-sm font-medium">
                    {project.name[0].toUpperCase() +
                      project.name.slice(1).toLowerCase()}
                  </span>
                </div>
              </Link>
            );
          }
        )}
      </div>
    </div>
  );
};
