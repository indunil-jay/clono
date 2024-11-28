"use client"

import { Pencil } from "lucide-react"
import Link from "next/link"

import { SpinnerCircle } from "@/app/_components/custom/spinner-circle"
import { Button } from "@/app/_components/ui/button"
import { useGetProject } from "@/app/_features/projects/hooks/use-get-project"
import { ProjectAvatar } from "@/app/_features/projects/project-avatar"
import { TaskViewSwitcher } from "@/app/_features/tasks/task-view-switcher"

interface ProjectDetailsProps  {
 projectId:string
}

export const ProjectDetails= ({ projectId}:ProjectDetailsProps)=>{

  const {data:project , status} =  useGetProject({projectId})

   if(status==="pending") return <SpinnerCircle/>

   if(status==="error") return "project error"



return  <div className="flex flex-col gap-y-4 ">
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
            href={`/workspaces/${project.workspaceId}/projects/${project.id}/settings`}
          >
            Edit Project
            <Pencil />
          </Link>
        </Button>
      </div>
    </div>
    <TaskViewSwitcher workspaceId={project.workspaceId} projectId={projectId} />
  </div>
}