"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/app/_lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { DatePicker } from "@/app/_components/custom/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";

import { MemberAvatar } from "@/app/_features/members/member-avatar";
import { useUpdateTask } from "@/app/_features/tasks/hooks/use-update-task";
import { ReviewStatus, TaskStatus } from "@/src/entities/task.enums";
import { updateTaskFromSchema } from "@/src/interface-adapter/validation-schemas/task";
import { SpinnerCircle } from "@/app/_components/custom/spinner-circle";
import { TaskDetails } from "@/app/(dashboard)/workspaces/[workspaceId]/tasks/[taskId]/_components/assignee-details";

interface UpdateTaskFormProps {
  onCancle?: () => void;
  memberOptions: { id: string; name: string }[];
  task: TaskDetails;
}

export const UpdateTaskForm = ({
  onCancle,
  memberOptions,
  task,
}: UpdateTaskFormProps) => {
  const { mutate, isPending } = useUpdateTask();

  const form = useForm<z.infer<typeof updateTaskFromSchema>>({
    resolver: zodResolver(updateTaskFromSchema),
    defaultValues: {
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof updateTaskFromSchema>) => {
    mutate(
      { json: values, param: { taskId: task.id } },
      {
        onSuccess: () => {
          onCancle?.();
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle>Update a Tasks</CardTitle>
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
                    <FormLabel>Task Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter workspace name"
                        {...field}
                        disabled={
                          isPending ||
                          !task.isAdmin ||
                          task.reviewerStatus === ReviewStatus.ACCEPT
                        }
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                disabled={
                  isPending ||
                  !task.isAdmin ||
                  task.reviewerStatus === ReviewStatus.ACCEPT
                }
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        {...field}
                        disabled={
                          task.reviewerStatus === ReviewStatus.ACCEPT ||
                          isPending ||
                          !task.isAdmin
                        }
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>

                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      disabled={
                        isPending ||
                        !task.isAdmin ||
                        task.reviewerStatus === ReviewStatus.ACCEPT
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {memberOptions.map((member) => (
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

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>

                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      disabled={
                        isPending ||
                        !task.isAdmin ||
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
                          value={TaskStatus.BACKLOG}
                          disabled={
                            !task.isAdmin ||
                            task.reviewerStatus === ReviewStatus.ACCEPT
                          }
                        >
                          backlog
                        </SelectItem>

                        <SelectItem
                          value={TaskStatus.IN_PROGRESS}
                          disabled={task.reviewerStatus === ReviewStatus.ACCEPT}
                        >
                          in progress
                        </SelectItem>
                        <SelectItem
                          value={TaskStatus.IN_REVIEW}
                          disabled={
                            !task.isAdmin ||
                            task.reviewerStatus === ReviewStatus.ACCEPT
                          }
                        >
                          in review
                        </SelectItem>
                        <SelectItem
                          value={TaskStatus.TODO}
                          disabled={
                            !task.isAdmin ||
                            task.reviewerStatus === ReviewStatus.ACCEPT
                          }
                        >
                          todo
                        </SelectItem>
                        <SelectItem
                          value={TaskStatus.DONE}
                          disabled={
                            !task.isAdmin ||
                            task.reviewerStatus === ReviewStatus.ACCEPT
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
            </div>
            <DottedSeparator className="py-7" />

            <div className="flex items-center justify-between">
              <Button
                type="button"
                size={"lg"}
                variant={"secondary"}
                disabled={isPending}
                className={cn(!onCancle && "invisible")}
                onClick={onCancle}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size={"lg"}
                disabled={!form.formState.isDirty || isPending}
              >
                {isPending ? (
                  <span className=" flex items-center gap-2">
                    <span>Saving Changes</span>
                    <span>
                      <SpinnerCircle />
                    </span>
                  </span>
                ) : (
                  <span>Save Changes</span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
