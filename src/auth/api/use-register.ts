"use client";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/src/utils/rpc";
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
      return await response.json();
    },
    onSuccess: () => {
      router.replace("/sign-in");
    },
  });
  return mutation;
};
