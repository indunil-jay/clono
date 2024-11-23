"use client";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/app/_lib/honojs/rpc";
import { useToast } from "@/app/_hooks/use-toast";

type ResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.projects)[":projectId"]["$delete"]
>;

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.projects[":projectId"]["$delete"]({
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
      return await response.json();
    },
    onSuccess: async () => {
      toast({
        title: "project deleted",
      });

      return await queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete project",
        description: String(error.message),
      });
    },
  });
  return mutation;
};
