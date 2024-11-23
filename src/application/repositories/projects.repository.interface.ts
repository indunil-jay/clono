import {
  ProjectsCollectionInput,
  ProjectsCollectionUpdateInput,
  ProjectseCollectionDocument,
} from "@/src/entities/project.entity";
import { DocumentList } from "@/src/entities/workspace.entity";

export interface IProjectRepository {
  create: (
    data: ProjectsCollectionInput
  ) => Promise<ProjectseCollectionDocument>;

  getAllByWorkspaceId: (
    workspaceId: string
  ) => Promise<DocumentList<ProjectseCollectionDocument>>;

  getById: (projectId: string) => Promise<ProjectseCollectionDocument>;

  update: (
    projectId: string,
    projectObj: ProjectsCollectionUpdateInput
  ) => Promise<ProjectseCollectionDocument>;

  delete: (projectId: string) => Promise<void>;
}
