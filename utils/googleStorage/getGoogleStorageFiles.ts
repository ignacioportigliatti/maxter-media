import axios, { AxiosResponse } from "axios";
import { generateOAuth2Token } from "..";

export const getGoogleStorageFiles = async (
  bucket: string,
  folder: string,
  fileName?: string
) => {
  try {
    const OAuthToken = await generateOAuth2Token(
      process.env.NEXT_PUBLIC_BUCKET_KEYFILE as string
    );
    
    let url = `https://www.googleapis.com/storage/v1/b/${bucket}/o`;
    if (fileName) {
      url += `/${folder}%2F${encodeURIComponent(fileName)}`;
    } else {
      url += `?prefix=${encodeURIComponent(folder)}`;
    }
    
    const response: AxiosResponse = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${OAuthToken}`,
      },
    });

    if (response.status === 200) {
      return response.data.items;
    } else {
      console.error("Error al obtener los archivos:", response);
    }
  } catch (error) {
    console.error(error);
  }
};
