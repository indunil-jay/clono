"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/src/lib/honojs/rpc";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["sign-out"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.auth)["sign-out"]["$post"]
>;

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async () => {
      const response = await client.api.auth["sign-out"]["$post"]();
      //TODO:error  ahandle
      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      return await response.json();
    },
    onSuccess: async () => {
      //await queryClient.invalidateQueries({ queryKey: ["current"] });
      queryClient.removeQueries();

      router.refresh();
    },
  });
  return mutation;
};
