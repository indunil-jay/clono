import { createSessionClient } from "@/src/lib/appwrite/appwrite";

export const getCurrentUserSession = async () => {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    return;
  }
};
