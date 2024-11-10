"use client";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/src/lib/honojs/rpc";
import { useToast } from "@/app/_hooks/use-toast";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$delete"]
>;

//TODO: invalidate query not working
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.tasks[":taskId"]["$delete"]({
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to delete tasks");
      }
      return await response.json();
    },
    onSuccess: async ({ data }) => {
      toast({
        title: "tasks deleted",
      });

      await queryClient.invalidateQueries({
        queryKey: ["tasks", "task", data.$id],
      });

      // router.refresh();
    },
    onError: () => {
      toast({
        title: "Failed to delete task",
      });
    },
  });
  return mutation;
};
