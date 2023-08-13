import { NextResponse } from "next/server";
import { wasabiClient } from "@/utils/wasabi/wasabiClient";

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

  try {
    // Verificar si ya tenemos una URL firmada en caché para este fileName
    if (signedUrlCache[fileName] && signedUrlCache[fileName].expires > Date.now()) {
      console.log(`Usando URL firmada en caché para ${fileName}`)
      return NextResponse.json({
        method: isUpload === true ? "PUT" : "GET",
        url: signedUrlCache[fileName].url,
      });
    }

    // Generar una nueva URL firmada
    const params = {
      Bucket: bucketName,
      Key: fileName,
      ContentType: contentType,
      Expires: 60 * 60,
    };
    let url;

    if (isUpload === true) {
      url = await wasabiClient.getSignedUrl("putObject", params);
    } else {
      url = await wasabiClient.getSignedUrl("getObject", params);
    }

    // Almacenar la nueva URL firmada en caché
    signedUrlCache[fileName] = {
      url: url,
      expires: Date.now() + 60 * 60 * 1000, // Expira en una hora (ms)
    };
    console.log(`URL firmada almacenada en caché para ${fileName}`);
    return NextResponse.json({
      method: isUpload === true ? "PUT" : "GET",
      url: url,
    });
  } catch (error) {
    return NextResponse.json({ error: "Error al firmar la URL" });
  }
}
