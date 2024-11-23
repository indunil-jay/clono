import { getAllProjectsByWorkspaceIdUseCase } from "@/src/application/use-cases/projects/get-all-projects-by-workspace-id.use-case";
import { ProjectseCollectionDocument } from "@/src/entities/project.entity";
import { DocumentList } from "@/src/entities/workspace.entity";

const presenter = (
  collectionDocumentList: DocumentList<ProjectseCollectionDocument>
) => {
  return {
    workspaceAllProjects: collectionDocumentList.documents,
    totolProjects: collectionDocumentList.total,
  };
};

type getAllProjectsByWorkspaceIdControllerResponse = ReturnType<
  typeof presenter
>;

export const getAllProjectsByWorkspaceIdController = async (
  workspaceId: string
): Promise<getAllProjectsByWorkspaceIdControllerResponse> => {
  const projectCollectionDocumentList =
    await getAllProjectsByWorkspaceIdUseCase(workspaceId);

  return presenter(projectCollectionDocumentList);
};
