import { client } from "@/app/_lib/honojs/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetMembersInWorkspace = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const response = await client.api.members[":workspaceId"].$get({
        param: { workspaceId },
      });

      if (!response.ok) throw new Error("Failed to fetch workspaces.");

      return await response.json();
    },
  });
  return query;
};
