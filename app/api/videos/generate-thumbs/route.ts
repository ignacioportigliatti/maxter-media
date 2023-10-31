import { wasabiClient } from "@/utils/wasabi/wasabiClient";
import ffmpeg from "fluent-ffmpeg";
import { uploadToWasabi } from "../../upload/route";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { bucketName, videoMeta, signedVideoUrl } = body;

  try {
    const fileName = videoMeta.Key.split("/").pop()?.split(".")[0];
    const filePath = videoMeta.Key.split("/").slice(0, -1).join("/");

    const ffmpegThumbnail = ffmpeg(signedVideoUrl)
      .seekInput(1)
      .noAudio()
      .outputOptions("-frames:v 1")
      .outputOptions("-q:v 2")
      .outputOptions("-vf scale=320:-1")
      .outputOptions("-f image2")
      .outputOptions("-c:v mjpeg")

      .on("error", (err) => {
        console.log(err);
      })
      .pipe();

    if (!ffmpegThumbnail) {
      throw new Error("Failed to generate thumbnail");
    } else if (ffmpegThumbnail) {
      const uploadedFile = await uploadToWasabi({
        Bucket: bucketName,
        Key: `${filePath}/thumbs/${fileName}.jpg`,
        Body: ffmpegThumbnail,
      });

      return NextResponse.json({
        success: true,
        uploadedFile: uploadedFile,
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      error: error,
    });
  }
}
