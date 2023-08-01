import { Storage, TransferManager } from "@google-cloud/storage";
import { NextResponse } from "next/server";
import path from "path";

interface RequestBody {
    bucketName: string;
    filePath: string;
    destFileName: string;
    contentType: string;
  }


export async function POST (request: Request) {
    const body: RequestBody = await request.json();
    console.log(body);
    const { bucketName, filePath, destFileName, contentType } = body;
    const storage = new Storage({
        keyFilename: process.env.NEXT_PUBLIC_BUCKET_KEYFILE,
        projectId: process.env.NEXT_PUBLIC_GCLOUD_PROJECT_ID,
    });
    const bucket = storage.bucket(bucketName);
    const transferManager = new TransferManager(bucket);

  async function uploadFile() {
    const options = {
        destination: destFileName,
        gzip: true,
        resumable: true,
        chunkSize: 5 * 1024 * 1024, // 5MB
        contentType: contentType,
    };
    
    await bucket.upload('public/agency/astros-logo2.png');
   
  }

  uploadFile().catch(console.error).then(() => {
    return NextResponse.json({success: 'Archivo subido exitosamente'});
    });
}
