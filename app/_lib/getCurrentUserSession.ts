import { createSessionClient } from "@/src/tools/lib/appwrite/appwrite";

export const getCurrentUserSession = async () => {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    return;
  }
};
