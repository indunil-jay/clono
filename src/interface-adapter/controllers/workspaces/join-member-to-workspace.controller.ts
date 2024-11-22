import { joinMemeberToWorkspaceUseCase } from "@/src/application/use-cases/workspaces/join-member-to-workspace.use-case";
import { MemberCollectionDocument } from "@/src/entities/member.entity";

export const presenter = (collectionDocument: MemberCollectionDocument) => {
  return {
    worksapceId: collectionDocument.workspaceId,
  };
};

export type joinMemberToWorkspaceControllerResponse = ReturnType<
  typeof presenter
>;

export const joinMemberToWorkspaceController = async (
  workspaceId: string,
  inviteCode: string
): Promise<joinMemberToWorkspaceControllerResponse> => {
  const collectionDocument = await joinMemeberToWorkspaceUseCase(
    workspaceId,
    inviteCode
  );
  return presenter(collectionDocument);
};
