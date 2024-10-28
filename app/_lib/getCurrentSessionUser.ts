import { createSessionClient } from "@/src/lib/appwrite/appwrite";

export const getCurrentSessionUser = async () => {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    console.log("error");
    return null;
  }
};
