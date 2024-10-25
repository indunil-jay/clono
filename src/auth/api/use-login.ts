import { useMutation } from "@tanstack/react-query";
import type { AppType } from "@/app/api/[[...route]]/route";
import { client } from "@/src/utils/rpc";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["sign-in"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.auth)["sign-in"]["$post"]
>;

export const useLogin = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["sign-in"]["$post"]({ json });
      return await response.json();
    },
  });
  return mutation;
};
