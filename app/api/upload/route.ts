
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: Request, res: NextResponse) {
  try {
    const form = await req.formData();
    const groupName = form.get("groupName");
    const file = form.get("file");
    const uploadType = form.get("uploadType");
    console.log("groupName", groupName);
    console.log("file", file);
    console.log("uploadType", uploadType);


    return new NextResponse(JSON.stringify({ success: true }));
  } catch (error) {
    console.error("Error uploading file:", error);
    return new NextResponse(JSON.stringify({ error: "Ocurrió un error al subir el archivo" }));
  }
}


