"use client";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/src/lib/honojs/rpc";
import { useToast } from "@/app/_hooks/use-toast";

type ResponseType = InferResponseType<
  (typeof client.api.members)[":memberId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.members)[":memberId"]["$patch"]
>;

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.members[":memberId"]["$patch"]({
        param,
        json,
      });

      if (!response.ok) {
        throw new Error("Failed to uodate member");
      }
      return await response.json();
    },
    onSuccess: async () => {
      toast({
        title: "Member updated",
      });

      await queryClient.invalidateQueries({
        queryKey: ["member", "members"],
      });
    },
    onError: () => {
      toast({
        title: "Failed to update Member",
      });
    },
  });
  return mutation;
};
