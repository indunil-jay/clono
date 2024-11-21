import { updateWorkspaceUseCase } from "@/src/application/use-cases/workspaces/update-workspace.use-case";
import { WorkspaceCollectionDocument } from "@/src/entities/workspace.entity";
import {
  UpdateWorkspaceFormInput,
  updateWorkspaceFormSchema,
} from "@/src/interface-adapter/validation-schemas/workspace";

const presenter = (collection: WorkspaceCollectionDocument) => {
  return {
    workspaceId: collection.$id,
  };
};

export type updateWorkspaceControllerResponse = ReturnType<typeof presenter>;

export const updateWorkspaceController = async (
  inputData: UpdateWorkspaceFormInput,
  workspaceId: string
) => {
  const { data, error } = updateWorkspaceFormSchema.safeParse(inputData);

  if (error) {
    throw new Error("Validation error");
  }

  const collection = await updateWorkspaceUseCase(data, workspaceId);
  return presenter(collection);
};
