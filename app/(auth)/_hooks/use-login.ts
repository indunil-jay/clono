"use client";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/src/lib/honojs/rpc";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["sign-in"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.auth)["sign-in"]["$post"]
>;

export const useLogin = () => {
  const router = useRouter();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["sign-in"]["$post"]({ json });
      //TODO:error  ahandle
      if (!response.ok) {
        throw new Error("Failed to  login");
      }

      return await response.json();
    },
    onSuccess: () => {
      router.refresh();
    },
  });
  return mutation;
};
