import { WorkspaceIdClient } from "./client";

export const Workspace = ({ workspaceId }: { workspaceId: string }) => {
  return <WorkspaceIdClient workspaceId={workspaceId} />;
};
