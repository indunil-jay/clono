import { client } from "@/app/_lib/honojs/rpc";
import { TaskStatus } from "@/src/entities/task.enums";
import { useQuery } from "@tanstack/react-query";


interface UseGetProjectsProps {
  workspaceId: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  assigneeId?: string | null;
  dueDate?: string | null;
  search?: string | null;
}

export const useGetTasks = ({
  workspaceId,
  projectId,
  status,
  assigneeId,
  dueDate,
  search,
}: UseGetProjectsProps) => {

  const query = useQuery({
    queryKey: [
      "tasks",
      {
      workspaceId,
      projectId,
      status,
      assigneeId,
      dueDate,
      search,
      }
    ],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          status: status ?? undefined,
          assigneeId: assigneeId ?? undefined,
          dueDate: dueDate ?? undefined,
          search: search ?? undefined,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch tasks.");

      return await response.json();
    },
  });
  return query;
};
