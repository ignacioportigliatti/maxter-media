"use server";

import { Storage } from "@google-cloud/storage";

// Creates a client
const storage = new Storage({
  keyFilename: process.env.NEXT_PUBLIC_BUCKET_KEYFILE!,
});

// Interface para el objeto de caché de URLs firmadas
interface SignedUrlCache {
  [key: string]: {
    url: string;
    expires: number;
  };
}

// Objeto para almacenar el caché de URLs firmadas
const signedUrlCache: SignedUrlCache = {};

export async function getSignedUrl(
  bucketName: string,
  fileName: string
): Promise<string> {
  const cacheKey = `${bucketName}/${fileName}`;

  // Verificar si la URL firmada está en caché y aún es válida
  if (
    signedUrlCache[cacheKey] &&
    signedUrlCache[cacheKey].expires > Date.now()
  ) {
    return signedUrlCache[cacheKey].url;
  }

  // Las opciones permitirán acceso de lectura temporal al archivo
  const options = {
    version: "v2" as const,
    action: "read" as const,
    expires: Date.now() + 1000 * 60 * 60, // una hora
    
  };

  // Obtener una URL firmada v2 para el archivo
  const [url] = await storage
    .bucket(bucketName)
    .file(fileName)
    .getSignedUrl(options);

  // Almacenar la URL firmada en caché
  signedUrlCache[cacheKey] = {
    url,
    expires: options.expires,
  };

  return url;
}
