import { injectable } from "inversify";
import { ID, Query } from "node-appwrite";

import { IMembersRepository } from "@/src/application/repositories/members.repository.interface";
import {
  MemberCollectionDocument,
  MemberCollectionInput,
  MemberCollectionUpdateInput,
} from "@/src/entities/member.entity";
import { createSessionClient } from "@/src/tools/lib/appwrite/appwrite";
import { DATABASE_ID, MEMBERS_COLLECTION_ID } from "@/src/tools/lib/constants";
import { DocumentList } from "@/src/entities/workspace.entity";

@injectable()
export class MembersRepository implements IMembersRepository {
  public async getAllMembersByIds(
    userIds: string[]
  ): Promise<DocumentList<MemberCollectionDocument>> {
    const { databases } = await createSessionClient();
    return await databases.listDocuments(DATABASE_ID, MEMBERS_COLLECTION_ID, [
      Query.contains("userId", userIds),
    ]);
  }

  public async update(
    documentId: string,
    obj: MemberCollectionUpdateInput
  ): Promise<MemberCollectionDocument> {
    const { databases } = await createSessionClient();
    return await databases.updateDocument(
      DATABASE_ID,
      MEMBERS_COLLECTION_ID,
      documentId,
      obj
    );
  }

  public async deleteWorkspaceMember(documentId: string): Promise<void> {
    const { databases } = await createSessionClient();

    await databases.deleteDocument(
      DATABASE_ID,
      MEMBERS_COLLECTION_ID,
      documentId
    );
  }

  public async getAllMembersInWorkspace(
    workspaceId: string
  ): Promise<DocumentList<MemberCollectionDocument>> {
    const { databases } = await createSessionClient();
    return await databases.listDocuments(DATABASE_ID, MEMBERS_COLLECTION_ID, [
      Query.equal("workspaceId", workspaceId),
    ]);
  }

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

  public async getAllByUser(
    userId: string
  ): Promise<DocumentList<MemberCollectionDocument>> {
    const { databases } = await createSessionClient();
    return await databases.listDocuments(DATABASE_ID, MEMBERS_COLLECTION_ID, [
      Query.equal("userId", userId),
    ]);
  }
}
