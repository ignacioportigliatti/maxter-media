import { NextResponse } from "next/server";
import { wasabiClient } from "@/utils/wasabi/wasabiClient";
import { S3Customizations } from "aws-sdk/lib/services/s3";

interface RequestBody {
  bucketName: string;
  fileName: string;
  isUpload: boolean;
  contentType?: string;
}

export async function POST(request: Request) {
  const body: RequestBody = await request.json();
  const { bucketName, fileName, isUpload, contentType } = body;

  try {
    // Generar una nueva URL firmada
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Expires: 60 * 60,
    };

    let url;

    if (isUpload === true) {
      url = await wasabiClient.getSignedUrl("putObject", params);
    } else {
      url = await wasabiClient.getSignedUrl("getObject", {
        ...params,
        ResponseContentDisposition: `attachment; filename="${fileName}"`,
        ResponseContentType: contentType !== undefined ? contentType : "",
      });
    }

    return NextResponse.json({
      method: isUpload === true ? "PUT" : "GET",
      url: url,
    });
  } catch (error) {
    return NextResponse.json({ error: "Error al firmar la URL" });
  }
}
