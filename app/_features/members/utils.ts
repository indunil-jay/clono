import { DATABASE_ID, MEMBERS_COLLECTION_ID } from "@/src/lib/constants";
import { Query, type Databases } from "node-appwrite";

interface IGetMember {
  databases: Databases;
  workspaceId: string;
  userId: string;
}

export const getMember = async ({
  databases,
  workspaceId,
  userId,
}: IGetMember) => {
  const members = await databases.listDocuments(
    DATABASE_ID,
    MEMBERS_COLLECTION_ID,
    [Query.equal("workspaceId", workspaceId), Query.equal("userId", userId)]
  );

  return members.documents[0];
};
