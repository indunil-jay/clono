"use client";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/app/_lib/honojs/rpc";
import { useToast } from "@/app/_hooks/use-toast";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      // Ensure this method returns a valid JSON response
      const response = await client.api.projects[":projectId"]["$patch"]({
        form,
        param,
      });
      return await response.json(); // Adjust if needed
    },
    onSuccess: async ({ data }) => {
      toast({
        title: "Project upated",
      });

      // Invalidate the projects query to refetch data
      await queryClient.invalidateQueries({
        queryKey: ["projects", "project", data.$id],
      });

      router.refresh();
    },
    onError: () => {
      toast({
        title: "Failed to upated project",
      });
    },
  });

  return mutation;
};
