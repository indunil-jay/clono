import {
  AUTH_COOKIE,
  DATABASE_ID,
  MEMBERS_COLLECTION_ID,
  WORKSPACE_COLLECTION_ID,
} from "@/src/lib/constants";
import { cookies } from "next/headers";
import { Account, Client, Databases, Query } from "node-appwrite";
import { getMember } from "../members/utils";
import { Workspace } from "./types";

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
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = (await cookies()).get(AUTH_COOKIE);

    // console.log(session);
    if (!session || !session.value) return { documents: [], total: 0 };
    client.setSession(session.value);

    //
    const databases = new Databases(client);
    const account = new Account(client);
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
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = (await cookies()).get(AUTH_COOKIE);

    // console.log(session);
    if (!session || !session.value) return null;
    client.setSession(session.value);

    //TODO:
    const databases = new Databases(client);
    const account = new Account(client);
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
