"use client";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/app/_lib/honojs/rpc";
import { useToast } from "@/app/_hooks/use-toast";

type ResponseType = InferResponseType<
  (typeof client.api.members)[":memberId"]["workspaces"][":workspaceId"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.members)[":memberId"]["workspaces"][":workspaceId"]["$patch"]
>;

export const useUpdateWorkspaceMemberRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.members[":memberId"]["workspaces"][
        ":workspaceId"
      ]["$patch"]({ param });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.message || "An unknown server error occurred";
        throw new Error(errorMessage);
      }
      return await response.json();
    },
    onSuccess: async ({ data }) => {
      toast({
        title: "Member updated",
      });

      return await queryClient.invalidateQueries({
        queryKey: ["member", "members", data?.demoterId, data?.promoterId],
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update Member",
        description: String(error),
      });
    },
  });
  return mutation;
};
