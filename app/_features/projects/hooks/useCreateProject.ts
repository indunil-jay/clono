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
      // Ensure this method returns a valid JSON response
      const response = await client.api.projects["$post"]({ form });
      return await response.json(); // Adjust if needed
    },
    onSuccess: async () => {
      toast({
        title: "Project created",
      });

      // Invalidate the projects query to refetch data
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      toast({
        title: "Failed to create project",
      });
    },
  });

  return mutation;
};
