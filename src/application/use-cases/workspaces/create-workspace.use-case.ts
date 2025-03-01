import { getInjection } from "@/src/tools/DI/container";
import { CreateWorkspaceFormInput } from "@/src/interface-adapter/validation-schemas/workspace";
import { generateInviteCode } from "@/src/tools/lib/generate-invite-code";
import { createSessionClient } from "@/src/tools/lib/appwrite/appwrite";
import { MemberRole } from "@/src/entities/member.enum";

export const createWorkspaceUseCase = async (
  data: CreateWorkspaceFormInput
) => {
  const { image, name } = data;

  //get use from current session
  const { account } = await createSessionClient();
  const user = await account.get();

  //upload image into the bucket
  const storageService = getInjection("IStorageService");
  const uploadedImageUrl = await storageService.upload(image);

  //create workspace document
  const workspaceRepository = getInjection("IWorkspacesRepository");
  const workspace = await workspaceRepository.create({
    name,
    userId: user.$id,
    imageUrl: uploadedImageUrl,
    inviteCode: generateInviteCode(10),
  });

  //add workspace created user into member collection
  const membersRepository = getInjection("IMembersRepository");
  await membersRepository.create({
    userId: workspace.userId,
    workspaceId: workspace.$id,
    role: MemberRole.ADMIN,
  });

  return workspace;
};
