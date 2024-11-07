import { Button } from "@/app/_components/ui/button";
import { ProjectAvatar } from "@/app/_features/projects/project-avatar";
import { getProjectById } from "@/app/_features/projects/utils";
import { getCurrentSessionUser } from "@/app/_lib/getCurrentSessionUser";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { projectId: string };
}) {
  const { projectId } = await params;
  const user = await getCurrentSessionUser();

  if (!user) redirect("/sign-in");

  const project = await getProjectById({ projectId });

  if (!project) throw new Error("Project not found");
  return (
    <div className="flex flex-col gap-y-4 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            className="size-8"
          />
          <p>{project.name}</p>
        </div>

        <div>
          <Button variant={"secondary"} asChild size={"sm"}>
            <Link
              href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}
            >
              Edit Project
              <Pencil />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
