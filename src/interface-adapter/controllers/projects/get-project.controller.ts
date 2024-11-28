import { getProjectUseCase } from "@/src/application/use-cases/projects/get-project.use-case";
import { ProjectsCollectionDocument } from "@/src/entities/project.entity";




const presenter = (collectionDocument:ProjectsCollectionDocument)=>{
  return {
    id:collectionDocument.$id,
    name:collectionDocument.name,
    imageUrl:collectionDocument.imageUrl,
    workspaceId:collectionDocument.workspaceId,
  }
}



export type getProjectControllerResponse  = ReturnType<typeof presenter>

export const getProjectController = async (projectId: string):Promise<getProjectControllerResponse> => {
  const collectionDocument = await getProjectUseCase(projectId);
  return  presenter(collectionDocument)
};
