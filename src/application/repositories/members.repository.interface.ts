import {
  MemberCollectionDocument,
  MemberCollectionInput,
} from "@/src/entities/member.entity";
import { DocumentList } from "@/src/entities/workspace.entity";

export interface IMembersRepository {
  create: (data: MemberCollectionInput) => Promise<MemberCollectionDocument>;
  getWorkspaceMember: (
    memberId: string,
    workspaceId: string
  ) => Promise<MemberCollectionDocument>;

  getAllByUser: (
    userId: string
  ) => Promise<DocumentList<MemberCollectionDocument>>;

  getAllMembersInWorkspace: (
    workspaceId: string
  ) => Promise<DocumentList<MemberCollectionDocument>>;
}
