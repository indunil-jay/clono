import { client } from "@/app/_lib/honojs/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetWorkspaceInfoProps {
  workspaceId: string;
}

export const useGetWorkspacesInfo = ({
  workspaceId,
}: UseGetWorkspaceInfoProps) => {
  const query = useQuery({
    queryKey: ["workspaces", workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[":workspaceId"]["info"][
        "$get"
      ]({ param: { workspaceId } });

      if (!response.ok) throw new Error("Failed to fetch workspaces.");

      return await response.json();
    },
  });
  return query;
};
