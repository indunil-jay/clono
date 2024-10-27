"use client";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/src/lib/honojs/rpc";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["sign-up"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.auth)["sign-up"]["$post"]
>;

export const useRegister = () => {
  const router = useRouter();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["sign-up"]["$post"]({ json });
      //TODO:error  ahandle
      if (!response.ok) {
        throw new Error("Failed to register");
      }

      return await response.json();
    },
    onSuccess: () => {
      router.refresh();
    },
  });
  return mutation;
};
