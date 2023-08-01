import { Storage } from "@google-cloud/storage";
import { NextResponse } from "next/server";

// Creates a client
const storage = new Storage({
  keyFilename: process.env.NEXT_PUBLIC_BUCKET_KEYFILE,
});

// Interface para el objeto de caché de URLs firmadas
interface SignedUrlCache {
  [key: string]: {
    url: string;
    expires: number;
  };
}

interface RequestBody {
  bucketName: string;
  fileName: string;
  isUpload: boolean;
  contentType: string;
}

// Objeto para almacenar el caché de URLs firmadas
const signedUrlCache: SignedUrlCache = {};

export async function POST(request: Request) {
  const body: RequestBody = await request.json();
  const { bucketName, fileName, isUpload, contentType } = body;

  const cacheKey = `${bucketName}/${fileName}`;

  try {
    // Verificar si la URL firmada está en caché y aún es válida
    if (
      signedUrlCache[cacheKey] &&
      signedUrlCache[cacheKey].expires > Date.now()
    ) {
      return signedUrlCache[cacheKey].url;
    }

    // Las opciones permitirán acceso de lectura temporal al archivo

    if (isUpload === true) {
      const options = {
        version: "v2" as const,
        action: "write" as const,
        contentType: contentType,
        expires: Date.now() + 12000 * 60 * 60, // 12 horas
      };
      const signedUrl = await storage
        .bucket(bucketName)
        .file(fileName)
        .getSignedUrl(options);

      return NextResponse.json({
        method: "PUT",
        url: signedUrl[0],
      });
    } else {
      const options = {
        version: "v2" as const,
        action: "read" as const,
        expires: Date.now() + 1000 * 60 * 60, // una hora
      };
      const [url] = await storage
        .bucket(bucketName)
        .file(fileName)
        .getSignedUrl(options);

      // Almacenar la URL firmada en caché
      signedUrlCache[cacheKey] = {
        url,
        expires: options.expires,
      };

      return NextResponse.json({
        success: "URL firmada exitosamente",
        url: url,
      });
    }

    // Obtener una URL firmada v2 para el archivo
  } catch (error) {
    return NextResponse.json({ error: "Error al firmar la URL" });
  }
}
