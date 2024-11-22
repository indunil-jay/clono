import {
  DocumentList,
  WorkspaceCollectionDocument,
  WorkspacesCollectionInput,
  WorkspacesCollectionUpdateInput,
} from "@/src/entities/workspace.entity";

export interface IWorkspacesRepository {
  create: (
    data: WorkspacesCollectionInput
  ) => Promise<WorkspaceCollectionDocument>;

  getAllByUser: (
    userId: string
  ) => Promise<DocumentList<WorkspaceCollectionDocument>>;

  update: (
    workspaceObj: WorkspacesCollectionUpdateInput,
    workspaceId: string
  ) => Promise<WorkspaceCollectionDocument>;

  delete: (workspaceId: string) => Promise<void>;

  getWorkspacesByIds: (
    worspacesIds: string[]
  ) => Promise<DocumentList<WorkspaceCollectionDocument>>;

  getworkspaceById: (
    workspaceId: string
  ) => Promise<WorkspaceCollectionDocument>;
}
