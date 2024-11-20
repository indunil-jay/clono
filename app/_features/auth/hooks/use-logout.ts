"use client";

import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/app/_lib/honojs/rpc";
import { useToast } from "@/app/_hooks/use-toast";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["sign-out"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.auth)["sign-out"]["$post"]
>;

export const useLogout = () => {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["sign-out"]["$post"]({ json });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to sign out");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to sign out");
      }

      return result;
    },
    onSuccess: () => {
      return queryClient.removeQueries();
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: "Sign out failed",
        description: error.message || "An unexpected error occurred.",
      });
    },
    onSettled: () => {
      router.refresh();
    },
  });

  return mutation;
};
