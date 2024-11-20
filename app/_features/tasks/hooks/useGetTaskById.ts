import { client } from "@/app/_lib/honojs/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetTaskByIdProps {
  taskId: string;
}

export const useGetTasksById = ({ taskId }: UseGetTaskByIdProps) => {
  const query = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await client.api.tasks[":taskId"].$get({
        param: { taskId },
      });

      if (!response.ok) throw new Error("Failed to fetch task.");

      return await response.json();
    },
  });
  return query;
};
