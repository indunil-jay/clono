import { webpack } from "webpack";
import { client } from "@/app/_lib/honojs/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetMembersProps {
  workspaceId: string;
}

export const useGetMembers = ({ workspaceId }: UseGetMembersProps) => {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const response = await client.api.members.$get({
        query: { workspaceId },
      });

      if (!response.ok) throw new Error("Failed to fetch workspaces.");

      return await response.json();
    },
  });
  return query;
};
