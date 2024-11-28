"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, CopyIcon, ImageIcon } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { DottedSeparator } from "@/app/_components/custom/dotted-separator";
import { Avatar, AvatarFallback } from "@/app/_components/ui/avatar";
import { useConfirmModal } from "@/app/_components/custom/use-confirm-modal";
import { useToast } from "@/app/_hooks/use-toast";
import { SpinnerCircle } from "@/app/_components/custom/spinner-circle";

import { updateWorkspaceFormSchema } from "@/src/interface-adapter/validation-schemas/workspace";
import { WorkspaceCollectionDocument } from "@/src/entities/workspace.entity";

import { useUpdateInviteCodeWorkspace } from "@/app/_features/workspace/hooks/use-update-workspace-invite-code";
import { useUpdateWorkspace } from "@/app/_features/workspace/hooks/use-update-workspace";
import { useDeleteWorkspace } from "@/app/_features/workspace/hooks/use-delete-workspace";
import { useCurrent } from "../auth/hooks/use-current";
import { useGetWorkspacesInfo } from "./hooks/use-get-workspace-Info";
import { useWorkspaceId } from "./hooks/useWorkspaceId";

interface UpdateWorkspaceFormProps {
  onCancle?: () => void;
  initialValues: WorkspaceCollectionDocument;
}

export const UpdateWorkspaceForm = ({
  onCancle,
  initialValues,
}: UpdateWorkspaceFormProps) => {
  const form = useForm<z.infer<typeof updateWorkspaceFormSchema>>({
    resolver: zodResolver(updateWorkspaceFormSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { mutate: updateWorkspace, isPending: isUpdatePending } =
    useUpdateWorkspace();

  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();

  const { data: currentUserData, status: currentUserStatus } = useCurrent();

  const { mutate: updateInviteLink, isPending: isUpdatingWorkspaceInviteCode } =
    useUpdateInviteCodeWorkspace();

  const { data: workspaceInfoData, status: workspaceInfoStatus } =
    useGetWorkspacesInfo({ workspaceId });

  //update workspace
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      form.setValue("image", file);
    }
  };

  const onSubmit = (values: z.infer<typeof updateWorkspaceFormSchema>) => {
    const formData = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    updateWorkspace(
      { form: formData, param: { workspaceId: initialValues.$id } },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${data?.workspaceId}`);
        },
      }
    );
  };

  //delete workspace

  const [DeleteModal, confirmDelete] = useConfirmModal({
    title: "Delete Workspace",
    message: "This action cannot be undone",
    variant: "destructive",
  });

  const handleDelete = async () => {
    const ok = await confirmDelete();

    if (!ok) return;

    deleteWorkspace(
      { param: { workspaceId: initialValues.$id } },
      {
        onSuccess: () => {
          router.push("/");
        },
      }
    );
  };

  //update workspace invite-code

  const [ResetModal, confirmReset] = useConfirmModal({
    title: "Reset Workspace",
    message: "This will invalidate the current invite link.",
    variant: "destructive",
  });

  const handleReset = async () => {
    const ok = await confirmReset();

    if (!ok) return;

    updateInviteLink(
      { param: { workspaceId: initialValues.$id } },
      {
        onSuccess: () => {
          router.refresh();
        },
      }
    );
  };

  const { toast } = useToast();

  const inviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;
  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink).then(() =>
      toast({
        title: "Invite link copied to clipboard",
      })
    );
  };
  if (currentUserStatus === "pending" || workspaceInfoStatus === "pending")
    return "loading";
  if (currentUserStatus === "error" || workspaceInfoStatus === "error")
    return "error";

  const isAdmin = currentUserData.$id === workspaceInfoData.data?.userId;

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteModal />
      <ResetModal />

      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={onCancle ? onCancle : () => router.back()}
          >
            <ArrowLeft className="size-4 mr-1" />
            Back
          </Button>
          <CardTitle>{initialValues.name}</CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter workspace name"
                          {...field}
                          disabled={isUpdatePending}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="size-[72px] relative rounded-md overflow-hidden">
                            <Image
                              alt="workspace logo"
                              fill
                              className="object-cover"
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm">workspace Icon</p>
                          <p className="text-xs text-muted-foreground">
                            JPG, PNG, SVG, JPEG, max 1 MB
                          </p>
                          <input
                            className="hidden"
                            type="file"
                            about=".png, .jpg, .jpeg, .svg"
                            ref={inputRef}
                            disabled={isUpdatePending}
                            onChange={handleImageChange}
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              disabled={isUpdatePending}
                              variant={"destructive"}
                              size={"sm"}
                              className="w-fit mt-2"
                              onClick={() => {
                                field.onChange(null);
                                if (inputRef.current) {
                                  inputRef.current.value = "";
                                }
                              }}
                            >
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              disabled={isUpdatePending}
                              variant={"secondary"}
                              size={"sm"}
                              className="w-fit mt-2"
                              onClick={() => inputRef.current?.click()}
                            >
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
              <DottedSeparator className="py-7" />

              <div className="flex items-center justify-between">
                <Button
                  type="submit"
                  size={"lg"}
                  disabled={!form.formState.isDirty || isUpdatePending}
                >
                  {isUpdatePending ? (
                    <span className="flex gap-2">
                      <span>Saving Changes</span>{" "}
                      <SpinnerCircle></SpinnerCircle>
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Invite Members</h3>
            <p className="text-sm text-muted-foreground">
              Use the invite link to add members to your workspace.
            </p>
            <div className="mt-4">
              <div className="flex  items-center gap-x-2">
                <Input disabled value={inviteLink} />
                <Button
                  className="size-12"
                  variant={"secondary"}
                  onClick={handleCopyInviteLink}
                >
                  <CopyIcon className="size-5" />
                </Button>
              </div>
            </div>
          </div>
          <DottedSeparator className="py-7" />
          <div className="flex items-center justify-center">
            <Button
              className="mt-7 w-fit "
              size={"sm"}
              variant={"default"}
              type="button"
              disabled={isUpdatingWorkspaceInviteCode}
              onClick={handleReset}
            >
              {isUpdatingWorkspaceInviteCode ? (
                <span className="flex gap-2">
                  <span>Reseting Invite Link</span>{" "}
                  <SpinnerCircle></SpinnerCircle>
                </span>
              ) : (
                <span> Reset Invite Link</span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isAdmin && (
        <Card className="w-full h-full border-none shadow-none">
          <CardContent className="p-7">
            <div className="flex flex-col">
              <h3 className="font-bold">Danger Zone</h3>
              <p className="text-sm text-muted-foreground">
                Deleting a workspace is irreversible and will remove all
                associated data.
              </p>
              <Button
                className="mt-7 w-fit ml-auto"
                size={"sm"}
                variant={"destructive"}
                type="button"
                disabled={isDeletingWorkspace}
                onClick={handleDelete}
              >
                Delete Workspace
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
