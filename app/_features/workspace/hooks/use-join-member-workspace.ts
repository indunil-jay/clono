"use client";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/app/_lib/honojs/rpc";
import { useToast } from "@/app/_hooks/use-toast";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["join"][":inviteCode"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["join"][":inviteCode"]["$post"]
>;

export const useJoinMemberWorkspace = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"]["join"][
        ":inviteCode"
      ]["$post"]({
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to join workspace (useJoin Res)");
      }
      return await response.json();
    },
    onSuccess: async ({ data }) => {
      toast({
        title: "Joined workspace",
      });

      await queryClient.invalidateQueries({
        queryKey: ["workspaces", "workspace", data?.worksapceId],
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to join workspace (useJoin Error)",
        description: String(error.message),
      });
    },
  });
  return mutation;
};
