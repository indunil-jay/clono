import { getInjection } from "@/DI/container";
import { MemberRole } from "@/src/entities/member.enum";
import { createSessionClient } from "@/src/lib/appwrite/appwrite";
import { generateInviteCode } from "@/src/lib/generate-invite-code";

export const updateWorkspaceInviteCodeUseCase = async (workspaceId: string) => {
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

  //update workspace document
  const workspaceRepository = getInjection("IWorkspacesRepository");
  const workspace = await workspaceRepository.update(
    {
      inviteCode: generateInviteCode(10),
    },
    workspaceId
  );
  return workspace;
};
