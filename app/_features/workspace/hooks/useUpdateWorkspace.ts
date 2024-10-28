"use client";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/src/lib/honojs/rpc";
import { useToast } from "@/app/_hooks/use-toast";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"]
>;

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.workspaces[":workspaceId"]["$patch"]({
        form,
        param,
      });
      if (!response.ok) {
        throw new Error("Failed to update workspace.");
      }
      return await response.json();
    },
    onSuccess: async ({ data }) => {
      //toast.success("Workspace created");
      toast({
        title: "Workspace updated",
      });

      await queryClient.invalidateQueries({
        queryKey: ["workspaces", "workspace", data.$id],
      });
    },
    onError: () => {
      // toast.error("Failed to create workspace");
      toast({
        title: "Failed to create workspace",
      });
    },
  });
  return mutation;
};
