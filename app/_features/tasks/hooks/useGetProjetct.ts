import { client } from "@/src/lib/honojs/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetProjectsProps {
  workspaceId: string;
}

export const useGetTasks = ({ workspaceId }: UseGetProjectsProps) => {
  const query = useQuery({
    queryKey: ["tasks", workspaceId],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: { workspaceId },
      });

      if (!response.ok) throw new Error("Failed to fetch tasks.");

      return await response.json();
    },
  });
  return query;
};
