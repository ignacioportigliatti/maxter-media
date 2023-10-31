import { wasabiClient } from "@/utils/wasabi/wasabiClient";
import { NextResponse } from "next/server";
import ffmpeg from "fluent-ffmpeg";
import { uploadToWasabi } from "../upload/route";
import { createWriteStream } from "fs";

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
    const videos = await listVideos(
      bucketName,
      folderPath,
      needThumbs,
      groupName
    );
    return NextResponse.json({ success: true, videos: videos });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}

async function listVideos(
  bucketName: string,
  folderPath: string,
  needThumbs: boolean,
  groupName?: string
): Promise<any[]> {
  const videoParams = {
    Bucket: bucketName,
    Prefix: folderPath,
  };

  const { Contents: videoContents } = await listObjectsV2(videoParams);

  if (!videoContents) {
    return [];
  }

  const filteredVideos = videoContents.filter((video: any) =>
    video.Key?.endsWith(".mp4")
  );

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
    const segments = videoPath.split("/");
    const fileNameWithExtension = segments[segments.length - 1];
    const fileName = fileNameWithExtension.split(".")[0];
    const matchingThumb = thumbContents.length === filteredVideos.length ? thumbContents.find(
      (thumb: any) => thumb.Key === `${folderPath}/thumbs/${fileName}.jpg`
    ) : undefined;

    return {
      video: { ...video, Name: fileName },
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
