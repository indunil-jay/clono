import { getInjection } from "@/src/tools/DI/container";
import { MemberRole } from "@/src/entities/member.enum";
import { createSessionClient } from "@/src/tools/lib/appwrite/appwrite";

export const joinMemeberToWorkspaceUseCase = async (
  workspaceId: string,
  inviteCode: string
) => {
  //check user already in that workspace
  const { account } = await createSessionClient();
  const user = await account.get();

  const membersRepository = getInjection("IMembersRepository");
  const memebersCollectionDocument = await membersRepository.getWorkspaceMember(
    user.$id,
    workspaceId
  );

  //if so return
  if (memebersCollectionDocument) throw new Error(`you are already a member.`);

  //check request workspaceId already exits in workspace collection and invite code is same
  const workspacesRepository = getInjection("IWorkspacesRepository");
  const workspacesCollectionDocument =
    await workspacesRepository.getworkspaceById(workspaceId);

  if (workspacesCollectionDocument.inviteCode !== inviteCode) {
    throw new Error("invalid invite code.");
  }

  //if all ok,then create new entry in memeber collection role as memeber
  const newWorkspacesCollectionDocument = await membersRepository.create({
    userId: user.$id,
    workspaceId,
    role: MemberRole.MEMBER,
  });

  return newWorkspacesCollectionDocument;
};
