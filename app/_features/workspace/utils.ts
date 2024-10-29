import {
  DATABASE_ID,
  MEMBERS_COLLECTION_ID,
  WORKSPACE_COLLECTION_ID,
} from "@/src/lib/constants";

import { Query } from "node-appwrite";
import { getMember } from "../members/utils";
import { Workspace } from "./types";
import { createSessionClient } from "@/src/lib/appwrite/appwrite";

export const generateInviteCode = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

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
    const workspaces = await databases.getDocument<Workspace>(
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

    const workspace = await databases.getDocument<Workspace>(
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
