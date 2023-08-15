import { wasabiClient } from "@/utils/wasabi/wasabiClient";
import { ManagedUpload } from "aws-sdk/clients/s3";
import { NextResponse } from "next/server";

interface RequestBody {
  bucketName: string;
  filePath: string;
  fileBlob: any;
}

function uploadToWasabi(params: any): Promise<string> {
  return new Promise((resolve, reject) => {
    wasabiClient.upload(params, (err: Error, data: ManagedUpload.SendData) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(data.Key);
      }
    });
  });
}

export async function POST(request: Request) {
  const body: RequestBody = await request.json();
  const { bucketName, filePath, fileBlob } = body;

  const buffer = Buffer.from(fileBlob.data);
  const uploadParams = {
    Bucket: bucketName,
    Key: filePath,
    Body: buffer,
  };

  try {
    const uploadedKey = await uploadToWasabi(uploadParams);

    return NextResponse.json({ success: true, src: uploadedKey });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error });
  }
}
