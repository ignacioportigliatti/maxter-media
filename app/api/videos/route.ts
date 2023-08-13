import { wasabiClient } from "@/utils/wasabi/wasabiClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { bucketName, folderPath, needThumbs } = body;

  // Configura los parámetros de la solicitud para listar objetos
  const videoParams = {
    Bucket: bucketName,
    Prefix: folderPath,
  };

  // Realiza la solicitud para listar los objetos
  try {
    const videos = await new Promise((resolve, reject) => {
      wasabiClient.listObjectsV2(videoParams, (err, data) => {
        if (err) {
          reject(err);
        } else {
          // Filtra los objetos para obtener solo los videos
          const filteredVideos = data.Contents?.filter((video) => {
            return video.Key?.endsWith(".mp4");
          });
    
          if (needThumbs === true) {
            const thumbsParams = {
              Bucket: bucketName,
              Prefix: `${folderPath}/thumbs/`,
            };
    
            wasabiClient.listObjectsV2(thumbsParams, (thumbErr, thumbData) => {
              if (thumbErr) {
                reject(thumbErr);
              } else {
                const thumbObjects = thumbData.Contents;
    
                const videoThumbnailPairs = filteredVideos?.map((video) => {
                  const videoName = video.Key;
                  const matchingThumb = thumbObjects?.find((thumb) =>
                    thumb.Key === videoName?.replace("/videos/", "/videos/thumbs/").replace(".mp4", ".jpg")
                  );
    
                  return {
                    video: video,
                    thumbnail: matchingThumb,
                  };
                });
    
                resolve(videoThumbnailPairs);
              }
            });
          } else {
            resolve(filteredVideos);
          }
        }
      });
    });
    
    
    
    return NextResponse.json({ success: true, videos: videos });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}
