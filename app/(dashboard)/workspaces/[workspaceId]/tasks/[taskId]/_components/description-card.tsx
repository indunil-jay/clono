"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/app/_components/ui/button";
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
import { Textarea } from "@/app/_components/ui/textarea";
import { useUpdateTask } from "@/app/_features/tasks/hooks/use-update-task";
import { cn } from "@/app/_lib/utils";
import { SpinnerCircle } from "@/app/_components/custom/spinner-circle";
import { TaskDetails } from "./assignee-details";
import { ReviewStatus, TaskStatus } from "@/src/entities/task.enums";

type FieldKey = "description" | "assigneeComment" | "reviewerComment";

const baseSchema = z.object({
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long.")
    .max(500, "Description cannot exceed 500 characters."),
  assigneeComment: z
    .string()
    .min(5, "Comment must be at least 5 characters.")
    .max(300, "Comment cannot exceed 300 characters."),
  reviewerComment: z
    .string()
    .min(5, "Feedback must be at least 5 characters.")
    .max(300, "Feedback cannot exceed 300 characters."),
});

const dynamicFormSchema = (fieldKey: FieldKey) => {
  return z.object({
    [fieldKey]: baseSchema.shape[fieldKey],
  });
};

interface DescriptionCardProps {
  title: string;
  label: string;
  fieldKey: FieldKey;
  readOnly: boolean;
  defaultValue?: string;
  task: TaskDetails;
}

import { useState } from "react";

export const DescriptionCard = ({
  title,
  label,
  fieldKey,
  readOnly,
  defaultValue,
  task,
}: DescriptionCardProps) => {
  const form = useForm({
    resolver: zodResolver(dynamicFormSchema(fieldKey)),
    defaultValues: { [fieldKey]: defaultValue || "" },
  });

  const { mutate, isPending } = useUpdateTask();
  const [action, setAction] = useState<"accept" | "reject" | null>(null);

  function onSubmit(data: { [key: string]: string }) {
    if (fieldKey === "reviewerComment") {
      mutate({
        json: {
          [fieldKey]: data[fieldKey],
          reviewStatus:
            action === "accept" ? ReviewStatus.ACCEPT : ReviewStatus.DECLINE,
        },
        param: { taskId: task.id },
      });
    } else {
      mutate({
        json: { [fieldKey]: data[fieldKey] },
        param: { taskId: task.id },
      });
    }
  }

  return (
    <Card
      className={cn(
        !readOnly && "bg-muted pointer-events-none",
        task.reviewerStatus === ReviewStatus.DECLINE &&
          fieldKey === "reviewerComment" &&
          !task.isAdmin &&
          "bg-red-200",
        task.reviewerStatus === ReviewStatus.ACCEPT &&
          fieldKey === "reviewerComment" &&
          !task.isAdmin &&
          "bg-green-200"
      )}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name={fieldKey}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your message here"
                      className="resize-none"
                      {...field}
                      rows={5}
                      disabled={
                        task.reviewerStatus === ReviewStatus.ACCEPT ||
                        (fieldKey === "reviewerComment" &&
                          !task.assigneeComment)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {readOnly && task.reviewerStatus !== ReviewStatus.ACCEPT ? (
              fieldKey === "reviewerComment" &&
              task.status !== TaskStatus.DONE ? (
                !form.formState.isDirty ? (
                  <span className="text-muted-foreground text-xs my-2">
                    {!task.assigneeComment && null}
                    {(task.assigneeComment ||
                      task.reviewerStatus === ReviewStatus.DECLINE) &&
                      "Click start to edit"}
                  </span>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      disabled={!form.formState.isDirty}
                      type="submit"
                      onClick={() => setAction("accept")}
                    >
                      {isPending && action === "accept" ? (
                        <span className="flex gap-2">
                          <span>Accepting</span>
                          <SpinnerCircle />
                        </span>
                      ) : (
                        <span>Accept & Review</span>
                      )}
                    </Button>

                    <Button
                      variant="destructive"
                      disabled={!form.formState.isDirty}
                      type="submit"
                      onClick={() => setAction("reject")}
                    >
                      {isPending && action === "reject" ? (
                        <span className="flex gap-2">
                          <span>Rejecting</span>
                          <SpinnerCircle />
                        </span>
                      ) : (
                        <span>Reject & Review</span>
                      )}
                    </Button>
                  </div>
                )
              ) : null
            ) : null}

            {readOnly &&
            task.reviewerStatus !== ReviewStatus.ACCEPT &&
            (fieldKey === "assigneeComment" || fieldKey === "description") ? (
              task.status !== TaskStatus.DONE ? (
                !form.formState.isDirty ? (
                  <span className="text-muted-foreground text-xs my-2">
                    Click start to edit
                  </span>
                ) : (
                  <Button disabled={!form.formState.isDirty} type="submit">
                    {isPending ? (
                      <span className="flex gap-2">
                        <span>Saving Changes</span>
                        <SpinnerCircle />
                      </span>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </Button>
                )
              ) : null
            ) : null}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
