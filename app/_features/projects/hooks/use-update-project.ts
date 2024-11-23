"use client";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/app/_lib/honojs/rpc";
import { useToast } from "@/app/_hooks/use-toast";
import { useRouter } from "next/navigation";
import { error } from "console";

type ResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.projects)[":projectId"]["$patch"]
>;

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.projects[":projectId"]["$patch"]({
        form,
        param,
      });

      if (!response.ok) {
        throw new Error("Updating Error");
      }
      return await response.json();
    },
    onSuccess: async ({ data }) => {
      toast({
        title: "Project upated",
      });

      return await queryClient.invalidateQueries({
        queryKey: ["projects", "project", data?.$id],
      });
    },
    onError: (err) => {
      toast({
        title: "Failed to upated project",
        description: err.message,
      });
    },
  });

  return mutation;
};
