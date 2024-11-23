import { client } from "@/app/_lib/honojs/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetProjectsByWorkspaceId = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const query = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const response = await client.api.projects.$get({
        query: { workspaceId },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      return await response.json();
    },
  });
  return query;
};
