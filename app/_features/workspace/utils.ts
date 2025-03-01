import {
  DATABASE_ID,
  MEMBERS_COLLECTION_ID,
  WORKSPACE_COLLECTION_ID,
} from "@/src/tools/lib/constants";

import { Query } from "node-appwrite";
import { getMember } from "../members/utils";
import { createSessionClient } from "@/src/tools/lib/appwrite/appwrite";

export const getCurrentWorkspace = async () => {
  //TODO: proper error handle
  try {
    const { databases, account } = await createSessionClient();
    const user = await account.get();

    const members = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_COLLECTION_ID,
      [Query.equal("userId", user.$id)]
    );

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    //return back if the login user not part of a worksace
    if (members.total === 0) {
      return { documents: [], total: 0 };
    }

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACE_COLLECTION_ID,
      [Query.contains("$id", workspaceIds), Query.orderDesc("$createdAt")]
    );

    return workspaces;
  } catch (error) {
    console.log(error);
  }
};

export const getWorkspaceById = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  //TODO: proper error handle
  try {
    const { databases, account } = await createSessionClient();
    const user = await account.get();

    const members = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });

    if (!members) {
      return null;
    }
    const workspaces = await databases.getDocument(
      DATABASE_ID,
      WORKSPACE_COLLECTION_ID,
      workspaceId
    );

    return workspaces;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getWorkspaceInfo = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  //TODO: proper error handle
  try {
    const { databases } = await createSessionClient();

    const workspace = await databases.getDocument(
      DATABASE_ID,
      WORKSPACE_COLLECTION_ID,
      workspaceId
    );

    return { name: workspace.name };
  } catch (error) {
    console.log(error);
    return null;
  }
};
