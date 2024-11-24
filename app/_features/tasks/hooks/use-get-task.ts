import { client } from "@/app/_lib/honojs/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetTasksById = ({ taskId }: { taskId: string }) => {
  const query = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await client.api.tasks[":taskId"].$get({
        param: { taskId },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return await response.json();
    },
  });
  return query;
};
