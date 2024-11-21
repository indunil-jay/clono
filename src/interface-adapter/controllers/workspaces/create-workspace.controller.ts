import {
  CreateWorkspaceFormInput,
  createWorkspaceFormSchema,
} from "@/src/interface-adapter/validation-schemas/workspace";
import { createWorkspaceUseCase } from "@/src/application/use-cases/workspaces/create-workspace.use-case";
import { WorkspaceCollectionDocument } from "@/src/entities/workspace.entity";

const presenter = (collection: WorkspaceCollectionDocument) => {
  return {
    workspaceId: collection.$id,
  };
};

export type CreateWorkspaceControllerResponse = ReturnType<typeof presenter>;

export const createWorkspaceController = async (
  inputData: CreateWorkspaceFormInput
): Promise<CreateWorkspaceControllerResponse> => {
  const { data, error } = createWorkspaceFormSchema.safeParse(inputData);

  if (error) {
    throw new Error("Validation error");
  }

  const collection = await createWorkspaceUseCase(data);
  return presenter(collection);
};
