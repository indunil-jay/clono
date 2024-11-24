"use client";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/app/_lib/honojs/rpc";
import { useToast } from "@/app/_hooks/use-toast";

type ResponseType = InferResponseType<typeof client.api.projects.$post, 200>;
type RequestType = InferRequestType<typeof client.api.projects.$post>;

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.projects["$post"]({ form });

      // Check if the response is not ok and handle error
      if (!response.ok) {
        const errorData = await response.json(); // Parse error details
        // If response JSON has the message, we use it, otherwise, fall back to default message
        throw new Error(
          errorData?.message || "An error occurred while creating the project."
        );
      }

      // Return the response body if the request was successful
      return await response.json();
    },
    onSuccess: async () => {
      toast({
        title: "Project created",
      });
      return await queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create project",
        description: error.message,
      });
    },
  });

  return mutation;
};
