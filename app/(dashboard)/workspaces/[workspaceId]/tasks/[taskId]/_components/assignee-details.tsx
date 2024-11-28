"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { updateTaskFromSchema } from "@/src/interface-adapter/validation-schemas/task";
import { Label } from "@/app/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { MemberAvatar } from "@/app/_features/members/member-avatar";
import { TaskStatus } from "@/src/entities/task.enums";
import { useGetMembersInWorkspace } from "@/app/_features/members/hooks/use-get-members-in-workspace";
import { Spinner } from "@/app/_components/custom/spinner";
import { useGetTask } from "@/app/_features/tasks/hooks/use-get-task";

interface AssigneeDetailsProps {
  taskId: string;
  workspaceId: string;
}

export const AssigneeDetails = ({
  taskId,
  workspaceId,
}: AssigneeDetailsProps) => {
  const { data, isLoading } = useGetTask({ taskId });
  const form = useForm<z.infer<typeof updateTaskFromSchema>>({
    resolver: zodResolver(updateTaskFromSchema),
    defaultValues: {
      assigneeId: data?.data.tasksCollectionDocument.assigneeId,
      status: data?.data.tasksCollectionDocument.status,
    },
  });

  const { data: members } = useGetMembersInWorkspace({
    workspaceId,
  });

  const membersOptions = members?.data.map((member) => ({
    id: member.userId,
    name: member.name,
  }));

  const handleBlur = (
    field: keyof typeof updateTaskFromSchema,
    value: string | null
  ) => {
    console.log(value);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignee Details</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex gap-6 ">
          <Avatar className="h-24 w-24">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="w-full">
            <Form {...form}>
              <form>
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-8">
                    <FormField
                      control={form.control}
                      name="assigneeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assignee</FormLabel>

                          <Select
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                {isLoading && <Spinner />}
                                <SelectValue placeholder="Select assignee" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {membersOptions?.map((member) => (
                                <SelectItem key={member.id} value={member.id}>
                                  <div className="flex items-center gap-x-2">
                                    <MemberAvatar
                                      className="size-6"
                                      name={member.name}
                                    />

                                    {member.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col gap-y-3">
                      <Label>Assignee Email</Label>
                      <p className="text-muted-foreground text-sm">
                        {data?.data.usersCollectionDocument.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-y-8">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>

                          <Select
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              <SelectItem value={TaskStatus.BACKLOG}>
                                backlog
                              </SelectItem>

                              <SelectItem value={TaskStatus.IN_PROGRESS}>
                                in progress
                              </SelectItem>
                              <SelectItem value={TaskStatus.IN_REVIEW}>
                                in review
                              </SelectItem>
                              <SelectItem value={TaskStatus.TODO}>
                                todo
                              </SelectItem>
                              <SelectItem value={TaskStatus.DONE}>
                                done
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col gap-y-3">
                      <Label>Workspace Name</Label>
                      <p className="text-muted-foreground text-sm">
                        test workspace -01
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
