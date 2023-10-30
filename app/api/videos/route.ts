import { wasabiClient } from "@/utils/wasabi/wasabiClient";
import { NextResponse } from "next/server";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs/promises";
import axios from "axios";
import { uploadToWasabi } from "../upload/route";
import { ManagedUpload } from "aws-sdk/clients/s3";

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

  const generateVideoThumbnail = async (video: any) => {
    try {
      const filePath = video.Key;
      const fileName = filePath.split("/").pop()?.split(".")[0];

      const signedUrl = await wasabiClient.getSignedUrl("getObject", {
        Bucket: bucketName,
        Key: filePath,
        Expires: 60 * 60,
        ResponseContentDisposition: `attachment; filename="${fileName}"`,
      });

      const ffmpegThumbnail = await new Promise((resolve, reject) => {
        ffmpeg(signedUrl).screenshot({
          timestamps: [25],
          filename: `${fileName}.jpg`,
          folder: `${process.cwd()}/public/tmp/thumbs/${groupName}/`,
          size: "320x180",
        }).on("end", () => {
          resolve(true);
        }).on("error", (error) => {
          reject(error);
        });
      }
      );

      if (!ffmpegThumbnail) {
        throw new Error("Failed to generate thumbnail");
      } else if (ffmpegThumbnail === true) {
        const file = await fs.readFile(
          `${process.cwd()}/public/tmp/thumbs/${groupName}/${fileName}.jpg`
        );
        const uploadedFile = await uploadToWasabi({
          Bucket: bucketName,
          Key: `${folderPath}/thumbs/${fileName}.jpg`,
          Body: file,
        });
        

        return uploadedFile;
      }

      
    } catch (error) {
      console.log(error);
    }
  };

  if (thumbContents.length !== filteredVideos.length) {
    await fs.mkdir(
      `${process.cwd()}/public/tmp/thumbs/${groupName}`,
      { recursive: true }
    );
    const generatedThumbnails = await Promise.all(
      filteredVideos.map((video: any) => generateVideoThumbnail(video))
    ).finally(async () => {
      await fs.rm(`${process.cwd()}/public/tmp/thumbs/${groupName}`, {
        recursive: true,
      });
    });
    await thumbContents.push(...generatedThumbnails);
  }

  const videoThumbnailPairs = filteredVideos.map((video: any) => {
    const videoPath = video.Key;
    const segments = videoPath.split("/");
    const fileNameWithExtension = segments[segments.length - 1];
    const fileName = fileNameWithExtension.split(".")[0];
    const matchingThumb = thumbContents?.find(
      (thumb: any) => thumb.Key === `${folderPath}/thumbs/${fileName}.jpg`
    );

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
