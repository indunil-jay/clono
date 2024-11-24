import {
  MemberCollectionDocument,
  MemberCollectionInput,
  MemberCollectionUpdateInput,
} from "@/src/entities/member.entity";
import { DocumentList } from "@/src/entities/workspace.entity";

export interface IMembersRepository {
  create: (data: MemberCollectionInput) => Promise<MemberCollectionDocument>;

  getWorkspaceMember(
    memberId: string,
    workspaceId: string
  ): Promise<MemberCollectionDocument>;

  deleteWorkspaceMember(documentId: string): Promise<void>;

  getAllByUser(userId: string): Promise<DocumentList<MemberCollectionDocument>>;

  getAllMembersInWorkspace(
    workspaceId: string
  ): Promise<DocumentList<MemberCollectionDocument>>;

  update(
    documentId: string,
    obj: MemberCollectionUpdateInput
  ): Promise<MemberCollectionDocument>;

  getAllMembersByIds(
    userIds: string[]
  ): Promise<DocumentList<MemberCollectionDocument>>;
}
