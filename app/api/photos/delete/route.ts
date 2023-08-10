import { wasabiClient } from "@/utils/wasabi/wasabiClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { bucketName, fileKeyArray } = body;

  try {
    wasabiClient.deleteObjects({
      Bucket: bucketName,
      Delete: {
        Objects: fileKeyArray,
      }
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
