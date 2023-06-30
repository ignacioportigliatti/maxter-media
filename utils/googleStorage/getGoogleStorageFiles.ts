import axios, { AxiosResponse } from "axios";
import { generateOAuth2Token } from "..";

export const getGoogleStorageFiles = async (
  bucket: string,
  folder: string,
  fileName?: string,
  isMedia?: boolean
) => {
  try {
    const OAuthToken = await generateOAuth2Token(
      process.env.NEXT_PUBLIC_BUCKET_KEYFILE as string
    );
    
    let url = ``;
    if (fileName) {
      url += `https://storage.googleapis.com/download/storage/v1/b/${bucket}/o/${encodeURIComponent(folder)}%2F${encodeURIComponent(fileName)}` + (isMedia === true ? "?alt=media" : "");
    } else {
      url += `https://www.googleapis.com/storage/v1/b/${bucket}/o?prefix=${encodeURIComponent(folder)}`;
    }
    console.log('url', url);
    
    const response: AxiosResponse = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${OAuthToken}`,
      },
    });

    if (response.status === 200) {
      if (fileName) {
        return response.data;
      } else {
        return response.data.items;
      }
    } else {
      console.error("Error al obtener los archivos:", response);
    }
  } catch (error) {
    console.error(error);
  }
};
