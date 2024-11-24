"use client";
import { Button } from "@/app/_components/ui/button";
import { Task } from "./types";
import { PencilIcon, XIcon } from "lucide-react";
import { DottedSeparator } from "@/app/_components/custom/dotted-separator";
import { useState } from "react";
import { useUpdateTask } from "./hooks/useUpdateTask";
import { Textarea } from "@/app/_components/ui/textarea";

interface TaskDescriptionProps {
  task: any;
}

export const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.description);
  const { mutate, isPending } = useUpdateTask();

  const handleSave = () => {
    mutate(
      {
        json: { description: value },
        param: { taskId: task.$id },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Overview</p>
        <Button
          onClick={() => setIsEditing((prev) => !prev)}
          size="sm"
          variant={"secondary"}
        >
          {isEditing ? <XIcon /> : <PencilIcon className="size-4 mr-2" />}
          {isEditing ? "Cancel" : "Update"}
        </Button>
      </div>

      <DottedSeparator className="my-4" />

      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            placeholder="Add a description"
            value={value}
            rows={4}
            onChange={(e) => setValue(e.target.value)}
            disabled={isPending}
          />
          <Button
            className="w-fit ml-auto"
            size={"sm"}
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      ) : (
        <div>
          {task.description || (
            <span className="text-muted-foreground">No description set</span>
          )}
        </div>
      )}
    </div>
  );
};
