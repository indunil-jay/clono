"use client";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/app/_lib/honojs/rpc";
import { useToast } from "@/app/_hooks/use-toast";

type ResponseType = InferResponseType<typeof client.api.workspaces.$post>;
type RequestType = InferRequestType<typeof client.api.workspaces.$post>;

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.workspaces.$post({ form });
      return await response.json();
    },
    onSuccess: async () => {
      //toast.success("Workspace created");
      toast({
        title: "Workspace created",
      });

      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
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
