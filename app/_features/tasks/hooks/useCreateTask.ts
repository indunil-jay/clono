"use client";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/src/lib/honojs/rpc";
import { useToast } from "@/app/_hooks/use-toast";

type ResponseType = InferResponseType<typeof client.api.tasks.$post, 200>;
type RequestType = InferRequestType<typeof client.api.tasks.$post>;

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      // Ensure this method returns a valid JSON response
      const response = await client.api.tasks["$post"]({ json });
      return await response.json(); // Adjust if needed
    },
    onSuccess: async () => {
      toast({
        title: "tasks created",
      });

      // Invalidate the taskss query to refetch data
      await queryClient.invalidateQueries({ queryKey: ["taskss"] });
    },
    onError: () => {
      toast({
        title: "Failed to create tasks",
      });
    },
  });

  return mutation;
};
