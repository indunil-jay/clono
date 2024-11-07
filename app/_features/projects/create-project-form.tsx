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
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/app/_lib/utils";
import { useCreateProject } from "./hooks/useCreateProject";
import { createProjectSchemaForm } from "./schema";
import { useWorkspaceId } from "../workspace/hooks/useWorkspaceId";

interface CreateProjectFormProps {
  onCancle?: () => void;
}

export const CreateProjectForm = ({ onCancle }: CreateProjectFormProps) => {
  const { mutate, isPending } = useCreateProject();
  const workspaceId = useWorkspaceId();

  const form = useForm<z.infer<typeof createProjectSchemaForm>>({
    resolver: zodResolver(createProjectSchemaForm.omit({ workspaceId: true })),
    defaultValues: {
      name: "",
      image: "",
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

  const onSubmit = (values: z.infer<typeof createProjectSchemaForm>) => {
    //TODO:error handle and redirection to workspace
    console.log(values);
    const formData = {
      ...values,
      workspaceId,
      image: values.image instanceof File ? values.image : undefined,
    };
    mutate(
      { form: formData },
      {
        onSuccess: ({ data }) => {
          form.reset();
          //onCancle?.(); router clear up url,
          router.push(`/workspaces/${workspaceId}/projects/${data.$id}`);
        },
      }
    );
  };
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle>Create a new Project</CardTitle>
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
                    <FormLabel>Project Name</FormLabel>
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
                        <p className="text-sm">project Icon</p>
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
              <Button
                type="button"
                size={"lg"}
                variant={"secondary"}
                disabled={isPending}
                className={cn(!onCancle && "invisible")}
              >
                Cancel
              </Button>
              <Button type="submit" size={"lg"} disabled={isPending}>
                Create project
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
