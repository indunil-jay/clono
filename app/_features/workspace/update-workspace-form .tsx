"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../_components/ui/form";
import { updateWorkspaceSchemaForm } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../_components/ui/input";
import { Button } from "../../_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../_components/ui/card";
import { DottedSeparator } from "../../_components/custom/dotted-separator";
import { useRef } from "react";
import { Avatar, AvatarFallback } from "../../_components/ui/avatar";
import Image from "next/image";
import { ArrowLeft, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Workspace } from "./types";
import { useUpdateWorkspace } from "./hooks/useUpdateWorkspace";
import { useDeleteWorkspace } from "./hooks/useDeleteWorkspace";
import { useConfirmModal } from "@/app/_components/custom/use-confirm-modal";

interface UpdateWorkspaceFormProps {
  onCancle?: () => void;
  initialValues: Workspace;
}

export const UpdateWorkspaceForm = ({
  onCancle,
  initialValues,
}: UpdateWorkspaceFormProps) => {
  const { mutate, isPending } = useUpdateWorkspace();

  const form = useForm<z.infer<typeof updateWorkspaceSchemaForm>>({
    resolver: zodResolver(updateWorkspaceSchemaForm),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      form.setValue("image", file);
    }
  };

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchemaForm>) => {
    //TODO:error handle and redirection to workspace
    const formData = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    mutate(
      { form: formData, param: { workspaceId: initialValues.$id } },
      {
        onSuccess: ({ data }) => {
          form.reset();
          //onCancle?.(); router clear up url,
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };

  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();

  const [DialogModal, confirm] = useConfirmModal({
    title: "Delete Workspace",
    message: "This action cannot be undone",
    variant: "destructive",
  });

  const handleDelete = async () => {
    const ok = await confirm();
    console.log(ok);

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
  return (
    <div className="flex flex-col gap-y-4">
      <DialogModal />
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
                          disabled={isPending}
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
                            disabled={isPending}
                            onChange={handleImageChange}
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              disabled={isPending}
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
                              disabled={isPending}
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
                <Button type="submit" size={"lg"} disabled={isPending}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

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
    </div>
  );
};
