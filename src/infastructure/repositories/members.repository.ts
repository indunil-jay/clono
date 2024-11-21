import { injectable } from "inversify";
import { ID, Query } from "node-appwrite";

import { IMembersRepository } from "@/src/application/repositories/members.repository.interface";
import {
  MemberCollectionDocument,
  MemberCollectionInput,
} from "@/src/entities/member.entity";
import { createSessionClient } from "@/src/lib/appwrite/appwrite";
import { DATABASE_ID, MEMBERS_COLLECTION_ID } from "@/src/lib/constants";

@injectable()
export class MembersRepository implements IMembersRepository {
  public async create(
    memberObj: MemberCollectionInput
  ): Promise<MemberCollectionDocument> {
    const { databases } = await createSessionClient();

    return await databases.createDocument(
      DATABASE_ID,
      MEMBERS_COLLECTION_ID,
      ID.unique(),
      memberObj
    );
  }

  public async getWorkspaceMember(
    memberId: string,
    workspaceId: string
  ): Promise<MemberCollectionDocument> {
    const { databases } = await createSessionClient();

    const members = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_COLLECTION_ID,
      [Query.equal("workspaceId", workspaceId), Query.equal("userId", memberId)]
    );
    return members.documents[0] as MemberCollectionDocument;
  }
}