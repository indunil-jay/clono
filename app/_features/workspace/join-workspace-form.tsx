"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { DottedSeparator } from "@/app/_components/custom/dotted-separator";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";

import { useJoinMemberWorkspace } from "@/app/_features/workspace/hooks/use-join-member-workspace";

interface JoinWorkSpaceFormProps {
  initialValues: {
    name: string;
  };
}

export const JoinWorkSpaceForm = ({
  initialValues,
}: JoinWorkSpaceFormProps) => {
  const { mutate, isPending: isSumbit } = useJoinMemberWorkspace();
  const params = useParams();
  const router = useRouter();

  const OnSubmit = () => {
    mutate(
      {
        param: {
          workspaceId: params.workspaceId as string,
          inviteCode: params.inviteCode as string,
        },
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data?.worksapceId}`);
        },
      }
    );
  };
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join Wokrspace</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join <strong>{initialValues.name}</strong>{" "}
          workspace
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col gap-2 lg:flex-row items-center justify-between">
          <Button size={"lg"} type="button" className="w-full lg:w-fit" asChild>
            <Link href={"/"}>Cancle</Link>
          </Button>
          <Button
            onClick={OnSubmit}
            disabled={isSumbit}
            size={"lg"}
            type="button"
            className="w-full lg:w-fit"
          >
            Join Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
