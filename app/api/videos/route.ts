import { wasabiClient } from "@/utils/wasabi/wasabiClient";
import { NextResponse } from "next/server";

interface VideoRequestBody {
  bucketName: string;
  folderPath: string;
  needThumbs: boolean;
  groupName?: string;
}

export async function POST(req: Request) {
  const body: VideoRequestBody = await req.json();
  const { bucketName, folderPath, needThumbs, groupName } = body;

  try {
    const videos = await listVideos(bucketName, folderPath, needThumbs, groupName);
    return NextResponse.json({ success: true, videos: videos });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}

async function listVideos(bucketName: string, folderPath: string, needThumbs: boolean, groupName?: string,): Promise<any[]> {
  const videoParams = {
    Bucket: bucketName,
    Prefix: folderPath,
  };

  const { Contents: videoContents } = await listObjectsV2(videoParams);

  if (!videoContents) {
    return [];
  }

  const filteredVideos = videoContents.filter((video: any) => video.Key?.endsWith(".mp4"));

  if (!needThumbs) {
    return filteredVideos;
  }

  const thumbParams = {
    Bucket: bucketName,
    Prefix: `${folderPath}/thumbs/`,
  };

  const { Contents: thumbContents } = await listObjectsV2(thumbParams);

  const videoThumbnailPairs = filteredVideos.map((video: any) => {
    const videoPath = video.Key;
    const videoName = videoPath?.split("/").pop();
    const matchingThumb = thumbContents?.find((thumb: any) =>
      thumb.Key === `media/videos/${groupName}/thumbs/${videoName?.replace('.mp4', '.jpg')}`
    );

    return {
      video: video,
      thumbnail: matchingThumb,
    };
  });

  return videoThumbnailPairs;
}

function listObjectsV2(params: any): Promise<any> {
  return new Promise((resolve, reject) => {
    wasabiClient.listObjectsV2(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
