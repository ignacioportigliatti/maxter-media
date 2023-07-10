import axios, { AxiosResponse } from "axios";
import generateOAuth2Token from "./generateOAuth2Token";

export const getGoogleStorageFolders = async (
    bucket: string,
    folder: string
  ) => {
    try {
      const OAuthToken = await generateOAuth2Token(
        process.env.NEXT_PUBLIC_BUCKET_KEYFILE as string
      );
  
      const url = `https://www.googleapis.com/storage/v1/b/${bucket}/o?prefix=${encodeURIComponent(folder)}`;
      console.log('url', url);
  
      const response: AxiosResponse = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${OAuthToken}`,
        },
      });
  
      if (response.status === 200) {
        return response.data.items.filter((item: any) => item.name.endsWith("/"));
      } else {
        console.error("Error al obtener las carpetas:", response);
      }
    } catch (error) {
      console.error(error);
    }
  };
  