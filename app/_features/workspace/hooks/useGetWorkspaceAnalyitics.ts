import { client } from "@/app/_lib/honojs/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetWorkspaceAnalyiticsProps {
  workspaceId: string;
}

export const useGetWorkspaceAnalyitics = ({
  workspaceId,
}: UseGetWorkspaceAnalyiticsProps) => {
  const query = useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[":workspaceId"][
        "analytics"
      ].$get({
        param: { workspaceId },
      });

      if (!response.ok) throw new Error("Failed to fetch workspace analytics.");

      return await response.json();
    },
  });
  return query;
};
