import { wasabiClient } from "@/utils/wasabi/wasabiClient";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  const body = await req.json();
  const { bucketName, folderPath } = body;

  // Configura los parámetros de la solicitud para listar objetos
  const params = {
    Bucket: bucketName,
    Prefix: folderPath,
  };

  // Función recursiva para obtener todos los objetos paginados
  async function listAllObjectsRecursive(
    continuationToken: string | null,
    accumulatedObjects: any[] = []
  ): Promise<any[]> {
    const listParams = { ...params, ContinuationToken: continuationToken as string };
    try {
      const data = await new Promise<any>((resolve, reject) => {
        wasabiClient.listObjectsV2(listParams, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });

      const updatedObjects = accumulatedObjects.concat(data.Contents);

      if (data.NextContinuationToken) {
        return listAllObjectsRecursive(
          data.NextContinuationToken,
          updatedObjects
        );
      } else {
        return updatedObjects;
      }
    } catch (error) {
      throw error;
    }
  }

  try {
    const photos = await listAllObjectsRecursive(null);

    return NextResponse.json({ success: true, photos: photos });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}
