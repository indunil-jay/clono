import { client } from "@/app/_lib/honojs/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetWorkspacesAnalyitics = () => {
  const query = useQuery({
    queryKey: ["workspaces-analytics"],
    queryFn: async () => {
      const response = await client.api.workspaces["analytics"].$get();

      if (!response.ok) throw new Error("Failed to fetch workspace analytics.");

      return await response.json();
    },
  });
  return query;
};
