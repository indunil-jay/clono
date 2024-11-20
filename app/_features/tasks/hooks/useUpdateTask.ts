"use client";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/app/_lib/honojs/rpc";
import { useToast } from "@/app/_hooks/use-toast";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$patch"]
>;

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      // Ensure this method returns a valid JSON response
      const response = await client.api.tasks[":taskId"]["$patch"]({
        json,
        param,
      });
      return await response.json(); // Adjust if needed
    },
    mutationKey: ["task"],
    onSuccess: async ({ data }) => {
      toast({
        title: "tasks updated",
      });
      router.refresh;
      // Invalidate the taskss query to refetch data
      return await queryClient.invalidateQueries({
        queryKey: ["tasks", "task", data.$id],
      });
    },
    onError: () => {
      toast({
        title: "Failed to update tasks",
      });
    },
  });

  return mutation;
};
