import {
  WorkspaceCollectionDocument,
  WorkspacesCollectionInput,
} from "@/src/entities/workspace.entity";

export interface IWorkspacesRepository {
  create: (
    data: WorkspacesCollectionInput
  ) => Promise<WorkspaceCollectionDocument>;
}
