import { wasabiClient } from "@/utils/wasabi/wasabiClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { bucketName, fileKey } = body;

  try {
    wasabiClient.deleteObject({
      Bucket: bucketName,
      Key: fileKey,
    }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });

    return NextResponse.json({ success: "Archivo eliminado exitosamente" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}
