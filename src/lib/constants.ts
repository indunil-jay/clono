export const AUTH_COOKIE = "test-cookie";

export const DATABASE_ID = (process.env
  .NEXT_PUBLIC_APPWRITE_DATABASE_ID as string)!;

export const WORKSPACE_COLLECTION_ID = (process.env
  .NEXT_PUBLIC_APPWRITE_COLLECTION_WORKSPACES_ID as string)!;

export const IMAGE_BUCKET_ID = (process.env
  .NEXT_PUBLIC_APPWRITE_IMAGE_BUCKET_ID as string)!;
