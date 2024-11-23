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
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      return await response.json();
    },
    onSuccess: async () => {
      toast({
        title: "Project created",
      });
      return await queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to create project",
        description: String(error.message),
      });
    },
  });

  return mutation;
};
