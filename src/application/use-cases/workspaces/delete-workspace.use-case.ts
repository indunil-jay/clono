import { getInjection } from "@/src/tools/DI/container";
import { MemberRole } from "@/src/entities/member.enum";
import { createSessionClient } from "@/src/tools/lib/appwrite/appwrite";

export const deleteWorkspaceUseCase = async (workspaceId: string) => {
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

  //TODO:check all unlink
  //we need to delete image, associate members with workspace , workspace tasks
  const workspaceRepository = getInjection("IWorkspacesRepository");
  await workspaceRepository.delete(workspaceId);
};
