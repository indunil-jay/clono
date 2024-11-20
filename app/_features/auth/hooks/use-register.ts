"use client";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/app/_lib/honojs/rpc";
import { InferRequestType, InferResponseType } from "hono";
import { useToast } from "@/app/_hooks/use-toast";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["sign-up"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.auth)["sign-up"]["$post"]
>;

export const useRegister = () => {
  const { toast } = useToast();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["sign-up"]["$post"]({ json });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.message || "An unknown server error occurred";
        throw new Error(errorMessage);
      }

      return await response.json();
    },
    onSuccess: (data, { json: { username } }) => {
      toast({
        title: "sign up successfull.",
        description: `Welcome  ${username}`,
      });
      return router.push("/sign-in");
    },
    onError: (error) => {
      toast({
        title: "sign up failed.",
        description: String(error.message),
      });
    },
  });
  return mutation;
};
