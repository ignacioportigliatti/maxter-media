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

  // Realiza la solicitud para listar los objetos
  try {
    const videos = await new Promise((resolve, reject) => {
      wasabiClient.listObjectsV2(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const videoList =
            data.Contents?.map((obj) => {
              return {
                key: obj.Key,
                size: obj.Size,
                lastModified: obj.LastModified,
              };
            }) || [];
          resolve(videoList);
        }
      });
    });

    return NextResponse.json({ success: true, videos: videos });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}
