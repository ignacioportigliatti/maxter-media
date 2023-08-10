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
    // Generar una nueva URL firmada
    const params = {
      Bucket: bucketName,
      Key: fileName,
      ContentType: contentType,
      Expires: 60 * 60,
    };
    let url;

    if (isUpload === true) {
      // Generar una URL firmada para cargar el archivo (PUT)
      url = await wasabiClient.getSignedUrl("putObject", params);
    } else {
      // Generar una URL firmada para descargar el archivo (GET)
      url = await wasabiClient.getSignedUrl("getObject", params);
    }

    return NextResponse.json({
      method: isUpload === true ? "PUT" : "GET",
      url: url,
    });
  } catch (error) {
    return NextResponse.json({ error: "Error al firmar la URL" });
  }
}
