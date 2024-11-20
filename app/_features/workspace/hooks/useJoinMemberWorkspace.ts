"use client";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/app/_lib/honojs/rpc";
import { useToast } from "@/app/_hooks/use-toast";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["join"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["join"]["$post"]
>;

export const useJoinMemberWorkspace = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.workspaces[":workspaceId"]["join"][
        "$post"
      ]({
        param,
        json,
      });

      if (!response.ok) {
        throw new Error("Failed to join workspace (useJoin Res)");
      }
      return await response.json();
    },
    onSuccess: async ({ data }) => {
      //toast.success("Workspace created");
      toast({
        title: "Joined workspace",
      });

      await queryClient.invalidateQueries({
        queryKey: ["workspaces", "workspace", data.$id],
      });
    },
    onError: (error) => {
      // toast.error("Failed to create workspace");
      toast({
        title: "Failed to join workspace (useJoin Error)",
      });
    },
  });
  return mutation;
};
