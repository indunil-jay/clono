"use client";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/app/_lib/honojs/rpc";
import { useToast } from "@/app/_hooks/use-toast";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$delete"]
>;

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.tasks[":taskId"]["$delete"]({
        param,
      });

      if (!response.ok) {
        const errRes = await response.json();
        throw new Error(errRes.message);
      }
      return await response.json();
    },
    onSuccess: async () => {
      toast({
        title: "tasks deleted",
      });

      return await queryClient.invalidateQueries({
        queryKey: ["tasks", "task"],
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete task",
        description: error.message,
      });
    },
  });
  return mutation;
};
