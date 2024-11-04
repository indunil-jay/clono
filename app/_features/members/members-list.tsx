"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { useWorkspaceId } from "../workspace/hooks/useWorkspaceId";
import { Button } from "@/app/_components/ui/button";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { DottedSeparator } from "@/app/_components/custom/dotted-separator";
import { useGetMembers } from "./hooks/useGetMember";
import { Fragment } from "react";
import { MemberAvatar } from "./components/member-avatar";
import { Separator } from "@/app/_components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { useDeleteMember } from "./hooks/useDeleteMember";
import { useUpdateMember } from "./hooks/useUpdateMember";
import { MemberRole } from "./types";
import { useConfirmModal } from "@/app/_components/custom/use-confirm-modal";
import { useRouter } from "next/navigation";

export const MembersList = () => {
  const workspaceId = useWorkspaceId();
  const [DialogModal, confirm] = useConfirmModal({
    message: "This member will be removed from the workspace",
    title: "Remove member",
    variant: "destructive",
  });
  const { data } = useGetMembers({ workspaceId });
  const { mutate: deleteMember, isPending: isMemberDeleting } =
    useDeleteMember();
  const { mutate: updateMember, isPending: isMemberUpdating } =
    useUpdateMember();
  const router = useRouter();

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
        {data?.data.documents.map((member, index) => (
          <Fragment key={member.$id}>
            <div className="flex items-center gap-2">
              <MemberAvatar
                className="size-10"
                fallbackClassName="text-lg"
                name={member.name}
              />

              <div className="flex flex-col">
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>

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
                  <DropdownMenuItem
                    className="font-medium text-amber-700"
                    onClick={() => handleDeleteMember(member.$id)}
                    disabled={isMemberDeleting}
                  >
                    Remove {member.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {index < data.data.documents.length - 1 && (
              <Separator className="my-2.5 " />
            )}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};
