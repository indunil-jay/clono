import {
  MemberCollectionDocument,
  MemberCollectionInput,
} from "@/src/entities/member.entity";

export interface IMembersRepository {
  create: (data: MemberCollectionInput) => Promise<MemberCollectionDocument>;
}
