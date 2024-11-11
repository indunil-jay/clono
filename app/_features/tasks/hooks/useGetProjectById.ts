import { client } from "@/src/lib/honojs/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetProjectByIdProps {
  projectId: string;
}

//TODO: move endpoint to projeect resource
export const useGetProjectById = ({ projectId }: UseGetProjectByIdProps) => {
  const query = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await client.api.tasks[":projectId"].$get({
        param: { projectId },
      });

      if (!response.ok) throw new Error("Failed to fetch project");

      return await response.json();
    },
  });
  return query;
};
