import {
  ProjectsCollectionDocument,
  ProjectsCollectionInput,
  ProjectsCollectionUpdateInput,
} from "@/src/entities/project.entity";
import { DocumentList } from "@/src/entities/workspace.entity";

export interface IProjectRepository {
  create(data: ProjectsCollectionInput): Promise<ProjectsCollectionDocument>;

  getAllByWorkspaceId(
    workspaceId: string
  ): Promise<DocumentList<ProjectsCollectionDocument>>;

  getById(projectId: string): Promise<ProjectsCollectionDocument>;

  update(
    projectId: string,
    projectObj: ProjectsCollectionUpdateInput
  ): Promise<ProjectsCollectionDocument>;

  delete(projectId: string): Promise<void>;

  getAllByIds(
    projectIds: string[]
  ): Promise<DocumentList<ProjectsCollectionDocument>>;
}
