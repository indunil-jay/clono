"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../_components/ui/select";
import { useGetWorkspaces } from "./hooks/use-get-workspace";
import { RiAddCircleFill } from "react-icons/ri";
import { WorkspaceAvatar } from "./workspace-avatar";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "./hooks/useWorkspaceId";
import { useCreateWorkspaceModal } from "./hooks/use-create-workspace-modal";
import { SpinnerCircle } from "@/app/_components/custom/spinner-circle";

export const WorkspaceSwitcher = () => {
  const { data: workspacesData, status } = useGetWorkspaces();

  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { open } = useCreateWorkspaceModal();

  if (status === "error") {
    return "error loading workspaces";
  }

  const onSelect = (id: string) => {
    router.push(`/workspaces/${id}`);
  };
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="uppercase text-xs text-neutral-500 font-semibold">
          Workspaces
        </p>
        <RiAddCircleFill
          className="text-neutral-500 cursor-pointer size-5 transition hover:text-neutral-700 "
          onClick={open}
        />
      </div>

      <Select onValueChange={onSelect} value={workspaceId}>
        <SelectTrigger className=" w-full bg-neutral-200 font-medium p-1 focus:ring-transparent">
          <SelectValue placeholder="No workspace selected" />
          {status === "pending" && <SpinnerCircle />}
        </SelectTrigger>
        <SelectContent>
          {workspacesData?.data.workspaces.map((workspace) => (
            <SelectItem key={workspace.$id} value={workspace.$id}>
              <div className="flex items-center justify-start gap-3 font-medium">
                <WorkspaceAvatar
                  name={workspace.name}
                  image={workspace.imageUrl}
                />
                <span className="truncate">{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
