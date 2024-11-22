"use client";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { DottedSeparator } from "@/app/_components/custom/dotted-separator";
import { Separator } from "@/app/_components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { useConfirmModal } from "@/app/_components/custom/use-confirm-modal";
import { MemberAvatar } from "@/app/_features/members/components/member-avatar";

import { useGetMembersInWorkspace } from "./hooks/use-get-members-in-workspace";
import { useDeleteMember } from "./hooks/useDeleteMember";
import { useUpdateMember } from "./hooks/useUpdateMember";
import { MemberRole } from "./types";
import { useWorkspaceId } from "../workspace/hooks/useWorkspaceId";
import { useCurrent } from "../auth/hooks/use-current";
import { useGetWorkspacesInfo } from "../workspace/hooks/useGetWorkspaceInfo";

export const MembersList = () => {
  const workspaceId = useWorkspaceId();

  const { data, status: memberDataStatus } = useGetMembersInWorkspace({
    workspaceId,
  });

  const [DialogModal, confirm] = useConfirmModal({
    message: "This member will be removed from the workspace",
    title: "Remove member",
    variant: "destructive",
  });

  const { mutate: deleteMember, isPending: isMemberDeleting } =
    useDeleteMember();
  const { mutate: updateMember, isPending: isMemberUpdating } =
    useUpdateMember();
  const router = useRouter();

  const { data: currentUserData, status: currentUserStatus } = useCurrent();
  const { data: workspaceInfoData, status: workspaceInfoStatus } =
    useGetWorkspacesInfo({ workspaceId });

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({ json: { role }, param: { memberId } });
  };

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm();
    if (!ok) return;
    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          router.refresh();
        },
      }
    );
  };

  if (
    memberDataStatus === "pending" ||
    currentUserStatus === "pending" ||
    workspaceInfoStatus === "pending"
  )
    return "loading";
  if (
    memberDataStatus === "error" ||
    currentUserStatus === "error" ||
    workspaceInfoStatus === "error"
  )
    return "error";

  // Determine if the current user is the workspace creator (admin)
  const isAdmin = currentUserData.$id === workspaceInfoData.data.userId;

  return (
    <Card className="w-full h-full border-none shadow-none">
      <DialogModal />
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button asChild variant={"secondary"} size={"sm"}>
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">Member list</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        {data.data.map((member, index) => (
          <Fragment key={member.$id}>
            <div className="flex items-center gap-2">
              <MemberAvatar
                className="size-10"
                fallbackClassName="text-lg"
                name={member.name}
              />

              <div className="flex flex-col">
                <p className="text-sm font-medium">{member.name}</p>
                <div className="flex gap-2">
                  <p className="text-xs text-muted-foreground">
                    {member.email}
                  </p>
                  <span className="text-xs">{member.role}</span>
                </div>
              </div>

              {isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="ml-auto"
                      variant={"secondary"}
                      size={"icon"}
                    >
                      <MoreVerticalIcon className="size-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent side="bottom" align="end">
                    <DropdownMenuItem
                      className="font-medium"
                      onClick={() =>
                        handleUpdateMember(member.$id, MemberRole.ADMIN)
                      }
                      disabled={isMemberUpdating}
                    >
                      Set as Administrator
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="font-medium"
                      onClick={() =>
                        handleUpdateMember(member.$id, MemberRole.MEMBER)
                      }
                      disabled={isMemberUpdating}
                    >
                      Set as Member
                    </DropdownMenuItem>

                    {!(member.role === MemberRole.ADMIN) && (
                      <DropdownMenuItem
                        className="font-medium text-amber-700"
                        onClick={() => handleDeleteMember(member.$id)}
                        disabled={isMemberDeleting}
                      >
                        Remove {member.name}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {index < data.data.length - 1 && <Separator className="my-2.5 " />}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};
