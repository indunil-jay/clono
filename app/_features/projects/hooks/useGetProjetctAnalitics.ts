import { client } from "@/src/lib/honojs/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetProjectsAnaliticsProps {
  projectId: string;
}

export const useGetProjectsAnalitics = ({
  projectId,
}: UseGetProjectsAnaliticsProps) => {
  const query = useQuery({
    queryKey: ["project-analytics", projectId],
    queryFn: async () => {
      const response = await client.api.projects[":projectId"][
        "analytics"
      ].$get({
        param: { projectId },
      });

      if (!response.ok) throw new Error("Failed to fetch projects analytics.");

      return await response.json();
    },
  });
  return query;
};
