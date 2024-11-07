import { createSessionClient } from "@/src/lib/appwrite/appwrite";
import { DATABASE_ID, PROJECTS_COLLECTION_ID } from "@/src/lib/constants";
import { Project } from "./types";
import { getMember } from "../members/utils";

export const getProjectById = async ({ projectId }: { projectId: string }) => {
  try {
    const { databases, account } = await createSessionClient();
    const user = await account.get();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      projectId
    );

    const members = await getMember({
      databases,
      userId: user.$id,
      workspaceId: project.workspaceId,
    });

    if (!members) {
      return null;
    }

    return project;
  } catch (error) {
    console.log(error);
    return null;
  }
};
