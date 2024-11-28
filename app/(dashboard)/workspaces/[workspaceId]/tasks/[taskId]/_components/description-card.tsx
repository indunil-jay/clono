"use client";

import { useToast } from "@/app/_hooks/use-toast";
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
import { useGetTasksById } from "@/app/_features/tasks/hooks/use-get-task";

type FieldKey = "description" | "userComment" | "reviewerComment";

const baseSchema = z.object({
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long.")
    .max(500, "Description cannot exceed 500 characters."),
  userComment: z
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
}

/**
 *  we need disable task descripton and review filed  for member
 *  we need to diable Assignee comment for admin
 *  we need to disable all comments scetion, when admin is review the task,  if ok, if not  again task need to be update
 *
 */

export const DescriptionCard = ({
  title,
  label,
  fieldKey,
  readOnly,
  defaultValue,
}: DescriptionCardProps) => {
  const { toast } = useToast();
  //   const {} = useGetTasksById({});

  const form = useForm({
    resolver: zodResolver(dynamicFormSchema(fieldKey)),
    defaultValues: { [fieldKey]: defaultValue || "" },
  });

  const { mutate } = useUpdateTask();

  function onSubmit(data: { [key: string]: string }) {
    mutate(
      {
        json: { [fieldKey]: data[fieldKey] },
        param: { taskId: "someTaskId" },
      },
      {
        onSuccess: () => {
          toast({
            title: "You submitted the following values:",
            description: (
              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <code className="text-white">
                  {JSON.stringify(data, null, 2)}
                </code>
              </pre>
            ),
          });
        },
      }
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your message here "
                      className="resize-none"
                      {...field}
                      rows={5}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {!readOnly && <Button type="submit">Submit</Button>}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
