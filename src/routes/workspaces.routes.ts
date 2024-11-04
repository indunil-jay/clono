import { Hono } from "hono";
import { Query } from "node-appwrite";

import { sessionMiddleware } from "@/src/lib/appwrite/session-middleware";
import {
  DATABASE_ID,
  MEMBERS_COLLECTION_ID,
  WORKSPACE_COLLECTION_ID,
} from "@/src/lib/constants";

const app = new Hono().get("/", sessionMiddleware, async (ctx) => {
  const user = ctx.get("user");
  const databases = ctx.get("databases");

  //all members, that current user part of
  const members = await databases.listDocuments(
    DATABASE_ID,
    MEMBERS_COLLECTION_ID,
    [Query.equal("userId", user.$id)]
  );

  //return back if the login user not part of a worksace
  if (members.total === 0) {
    return ctx.json({ data: { documents: [], total: 0 } });
  }

  const workspaceIds = members.documents.map((member) => member.workspaceId);

  const workspaces = await databases.listDocuments(
    DATABASE_ID,
    WORKSPACE_COLLECTION_ID,
    [Query.contains("$id", workspaceIds), Query.orderDesc("$createdAt")]
  );

  return ctx.json({ data: workspaces });
});

export default app;
