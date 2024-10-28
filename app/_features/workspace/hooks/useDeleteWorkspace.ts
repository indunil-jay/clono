"use client";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/src/lib/honojs/rpc";
import { useToast } from "@/app/_hooks/use-toast";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"]
>;

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"]["$delete"]({
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to delete workspace");
      }
      return await response.json();
    },
    onSuccess: async ({ data }) => {
      //toast.success("Workspace created");
      toast({
        title: "Workspace deleted",
      });

      await queryClient.invalidateQueries({
        queryKey: ["workspaces", data.$id],
      });
    },
    onError: () => {
      // toast.error("Failed to create workspace");
      toast({
        title: "Failed to delete workspace",
      });
    },
  });
  return mutation;
};
