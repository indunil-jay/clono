import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef } from "react";
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
import { Label } from "@/app/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { MemberAvatar } from "@/app/_features/members/member-avatar";
import { ReviewStatus, TaskStatus } from "@/src/entities/task.enums";
import { useGetMembersInWorkspace } from "@/app/_features/members/hooks/use-get-members-in-workspace";
import { DatePicker } from "@/app/_components/custom/date-picker";
import { useUpdateTask } from "@/app/_features/tasks/hooks/use-update-task";
import { updateTaskFromSchema } from "@/src/interface-adapter/validation-schemas/task";

export interface TaskDetails {
  name?: string;
  id: string;
  assigneeId: string;
  status: TaskStatus;
  email: string;
  workspaceId: string;
  workspaceName: string;
  dueDate: string;
  isAdmin?: boolean;
  sessionUserId?: string;
  assigneeComment: string | undefined;
  description: string | undefined;
  reviewerComment: string | undefined;
  reviewerStatus: ReviewStatus | undefined;
}

interface AssigneeDetailsProps {
  workspaceId: string;
  task: TaskDetails;
}

export const AssigneeDetails = ({ task }: AssigneeDetailsProps) => {
  const { data: members } = useGetMembersInWorkspace({
    workspaceId: task.workspaceId,
  });

  const form = useForm<z.infer<typeof updateTaskFromSchema>>({
    resolver: zodResolver(updateTaskFromSchema),
    defaultValues: {
      assigneeId: task.assigneeId,
      status: task.status as TaskStatus,
      dueDate: new Date(task.dueDate),
    },
  });

  const membersOptions = members?.data.map((member) => ({
    id: member.userId,
    name: member.name,
  }));

  const { mutate, isPending } = useUpdateTask();

  const previousValues = useRef<{
    assigneeId: string;
    status: TaskStatus;
    dueDate: Date;
  }>({
    assigneeId: task.assigneeId,
    status: task.status as TaskStatus,
    dueDate: new Date(task.dueDate),
  });

  const handleBlur = (
    field: keyof typeof previousValues.current,
    value: (typeof previousValues.current)[keyof typeof previousValues.current]
  ) => {
    if (
      field &&
      value !== undefined &&
      value !== previousValues.current[field]
    ) {
      mutate({ json: { [field]: value }, param: { taskId: task.id } });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      previousValues.current[field] = value;
    }
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
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleBlur("assigneeId", value);
                            }}
                            disabled={
                              !task.isAdmin ||
                              isPending ||
                              task.reviewerStatus === ReviewStatus.ACCEPT
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
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
                        {task.email}
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
                            onValueChange={(value: TaskStatus) => {
                              field.onChange(value);
                              handleBlur("status", value);
                            }}
                            disabled={
                              (!task.isAdmin &&
                                task.assigneeId !== task.sessionUserId) ||
                              isPending ||
                              task.reviewerStatus === ReviewStatus.ACCEPT
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              <SelectItem
                                disabled={
                                  !task.isAdmin || !!task.assigneeComment
                                }
                                value={TaskStatus.BACKLOG}
                              >
                                backlog
                              </SelectItem>

                              <SelectItem
                                value={TaskStatus.IN_PROGRESS}
                                disabled={!!task.assigneeComment}
                              >
                                in progress
                              </SelectItem>
                              <SelectItem
                                value={TaskStatus.IN_REVIEW}
                                disabled={
                                  !task.isAdmin || !!task.assigneeComment
                                }
                              >
                                in review
                              </SelectItem>

                              <SelectItem
                                value={TaskStatus.TODO}
                                disabled={
                                  !task.isAdmin || !!task.assigneeComment
                                }
                              >
                                todo
                              </SelectItem>
                              <SelectItem
                                value={TaskStatus.DONE}
                                disabled={
                                  !task.isAdmin || !!task.assigneeComment
                                }
                              >
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
                        {task.workspaceName}
                      </p>
                    </div>
                  </div>

                  <FormField
                    disabled={
                      !task.isAdmin ||
                      task.reviewerStatus === ReviewStatus.ACCEPT ||
                      isPending
                    }
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <div
                            tabIndex={1}
                            onBlur={() => {
                              if (field.value !== undefined) {
                                handleBlur("dueDate", field.value);
                              }
                            }}
                          >
                            <DatePicker
                              {...field}
                              disabled={!task.isAdmin || isPending}
                            />
                          </div>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
