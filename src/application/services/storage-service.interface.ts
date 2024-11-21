export interface IStorageService {
  upload: (image: File | string | undefined) => Promise<string | undefined>;
}
