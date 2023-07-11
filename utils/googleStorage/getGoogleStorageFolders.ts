import { Storage } from "@google-cloud/storage";

export const getGoogleStorageFolders = async (bucketName: string, folderPath: string) => {
  try {
    const storage = new Storage();
    const bucket = storage.bucket(bucketName);
    const prefix = `${folderPath}/`;

    const [files] = await bucket.getFiles({ prefix });
    const folders = new Set<string>();

    files.forEach((file) => {
      const filePath = file.name.split("/");
      if (filePath.length > 1) {
        folders.add(filePath[1]);
      }
    });

    return Array.from(folders);
  } catch (error) {
    console.error("Error al obtener las carpetas:", error);
    throw error;
  }
};
