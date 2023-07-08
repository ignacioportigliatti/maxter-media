import axios, { AxiosResponse, AxiosProgressEvent } from "axios";
import { generateOAuth2Token } from "..";

type ProgressCallback = (progress: number) => void;

export const uploadGoogleStorageFile = async (
  file: File,
  folder: string,
  bucket: string,
  isPublic?: boolean,
  progressCallback?: ProgressCallback
) => {  
  try {
    const OAuthToken = await generateOAuth2Token(
      process.env.NEXT_PUBLIC_BUCKET_KEYFILE as string
    );
    const uploadResponse: AxiosResponse = await axios.post(
      `https://www.googleapis.com/upload/storage/v1/b/${bucket}/o?uploadType=media&name=${folder}/${file.name}`,
      file,
      {
        headers: {
          Authorization: `Bearer ${OAuthToken}`,
          "Content-Type": file.type,
        },
      }
    );

    if (uploadResponse.status === 200) {
      if (isPublic === true) {
        try {
          await axios.post(
            `https://www.googleapis.com/storage/v1/b/${bucket}/o/${encodeURIComponent(
              folder
            )}%2F${file.name}/acl`,
            {
              entity: "allUsers",
              role: "READER",
            },
            {
              headers: {
                Authorization: `Bearer ${OAuthToken}`,
              },
            }
          );
          const publicLink = `https://storage.googleapis.com/${bucket}/${folder}/${file.name}`;
          return publicLink;
        } catch (error) {
          console.error("Error al hacer público el archivo", error);
        }
      }
      return uploadResponse.data;
    } else {
      console.error("Error al subir el archivo:", uploadResponse.data);
    }
  } catch (error) {
    console.error(error);
  }
};
