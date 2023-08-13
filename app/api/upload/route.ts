import { wasabiClient } from "@/utils/wasabi/wasabiClient";
import { ManagedUpload } from "aws-sdk/clients/s3";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const { bucketName, filePath, fileBlob } = body;

    const params = {
        Bucket: bucketName,
        Key: filePath,
        Body: fileBlob,
    }

    try {
        const uploadedFileKey = await new Promise((resolve, reject) => {
           try {
            wasabiClient.upload(params, (err: Error, data: ManagedUpload.SendData) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(data);
                    resolve(data.Key);
                }
            });
           } catch (error) {
            console.error(error);
           }
        })

        return NextResponse.json({ success: true, fileKey: uploadedFileKey })
    } catch (error) {
        return NextResponse.json({ success: false, error: error })
    }
}