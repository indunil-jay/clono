import { injectable } from "inversify";
import { ID } from "node-appwrite";
import { IStorageService } from "@/src/application/services/storage-service.interface";
import { IMAGE_BUCKET_ID } from "@/src/tools/lib/constants";
import { Context } from "hono";
import { createSessionClient } from "@/src/tools/lib/appwrite/appwrite";

//TODO:error handle  when workspace delete image should delete

@injectable()
export class StorageService implements IStorageService {
  constructor() {}
  public async upload(
    image: File | string | undefined
  ): Promise<string | undefined> {
    const { storage } = await createSessionClient();

    let uploadedImageUrl: string | undefined = undefined;

    if (image instanceof File) {
      const file = await storage.createFile(
        IMAGE_BUCKET_ID,
        ID.unique(),
        image
      );

      const arrayBuffer = await storage.getFilePreview(
        IMAGE_BUCKET_ID,
        file.$id
      );

      uploadedImageUrl = `data:image/png;base64,${Buffer.from(
        arrayBuffer
      ).toString("base64")}`;
    }
    return uploadedImageUrl;
  }
}
