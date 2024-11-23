"use client";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/app/_lib/honojs/rpc";
import { useToast } from "@/app/_hooks/use-toast";

type ResponseType = InferResponseType<
  (typeof client.api.members)[":memberId"]["workspaces"][":workspaceId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.members)[":memberId"]["workspaces"][":workspaceId"]["$delete"]
>;

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.members[":memberId"]["workspaces"][
        ":workspaceId"
      ]["$delete"]({
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to delete workspace");
      }
      return await response.json();
    },
    onSuccess: async () => {
      toast({
        title: "Member deleted",
      });

      return await queryClient.invalidateQueries({
        queryKey: ["member", "members"],
      });
    },
    onError: () => {
      toast({
        title: "Failed to delete Member",
      });
    },
  });
  return mutation;
};
