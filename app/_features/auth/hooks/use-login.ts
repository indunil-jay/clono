import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/app/_lib/honojs/rpc";
import { useToast } from "@/app/_hooks/use-toast";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["sign-in"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.auth)["sign-in"]["$post"]
>;

export const useLogin = () => {
  const { toast } = useToast();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["sign-in"]["$post"]({ json });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.message || "An unknown server error occurred";
        throw new Error(errorMessage);
      }

      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "sign in successful",
        description: "Welcome back!",
      });
    },
    onError: (error) => {
      toast({
        title: "sign in failed",
        description: String(error.message),
      });
    },
    onSettled: () => {
      return router.refresh();
    },
  });

  return mutation;
};
