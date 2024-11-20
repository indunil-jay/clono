"use client";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/app/_lib/honojs/rpc";
import { useToast } from "@/app/_hooks/use-toast";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"]
>;

export const useUpdateInviteCodeWorkspace = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"][
        "reset-invite-code"
      ]["$post"]({
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to update workspace invite code");
      }
      return await response.json();
    },
    onSuccess: async ({ data }) => {
      //toast.success("Workspace created");
      toast({
        title: "Workspace invite code updated.",
      });

      await queryClient.invalidateQueries({
        queryKey: ["workspaces", data.$id],
      });
    },
    onError: () => {
      // toast.error("Failed to create workspace");
      toast({
        title: "Failed to update workspace invite code",
      });
    },
  });
  return mutation;
};
