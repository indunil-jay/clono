import { getInjection } from "@/DI/container";
import { MemberRole } from "@/src/entities/member.enum";
import { UpdateWorkspaceFormInput } from "@/src/interface-adapter/validation-schemas/workspace";
import { createSessionClient } from "@/src/lib/appwrite/appwrite";

export const updateWorkspaceUseCase = async (
  inputData: UpdateWorkspaceFormInput,
  workspaceId: string
) => {
  //check if user is allow to update workspace.
  const { account } = await createSessionClient();
  const user = await account.get();

  const memberRepository = getInjection("IMembersRepository");
  const member = await memberRepository.getWorkspaceMember(
    user.$id,
    workspaceId
  );

  //throw unauthorized error
  if (!member || member.role !== MemberRole.ADMIN) {
    throw new Error("Unauthorize");
  }

  //image upload to the bucket
  const storage = getInjection("IStorageService");
  const imageUrl = await storage.upload(inputData.image);

  //update workpace document
  const workspaceRepository = getInjection("IWorkspacesRepository");

  const workspace = await workspaceRepository.update(
    { name: inputData.name, imageUrl },
    workspaceId
  );

  return workspace;
};
