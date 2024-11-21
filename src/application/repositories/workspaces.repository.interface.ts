import {
  DocumentList,
  WorkspaceCollectionDocument,
  WorkspacesCollectionInput,
  WorkspacesCollectionUpdateInput,
} from "@/src/entities/workspace.entity";
import { UpdateWorkspaceFormInput } from "@/src/interface-adapter/validation-schemas/workspace";

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
}
