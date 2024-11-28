import { InferResponseType } from "hono";
import { client } from "@/app/_lib/honojs/rpc";
import { useQuery } from "@tanstack/react-query";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$get"],
  200
>;

interface UseGetTasksByIdParams {
  taskId: string;
}

export const useGetTask = ({ taskId }: UseGetTasksByIdParams) => {
  return useQuery<ResponseType>({
    queryKey: ["task", taskId],
    queryFn: async () => {
      if (!taskId) {
        throw new Error("Task ID is required");
      }

      const response = await client.api.tasks[":taskId"].$get({
        param: { taskId },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch task");
      }

      return await response.json();
    },
    enabled: !!taskId,
  });
};
