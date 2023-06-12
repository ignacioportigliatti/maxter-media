import { NextResponse } from "next/server";
import { Videos } from "@prisma/client";
import prisma from "@/libs/prismadb";

export async function POST(req: Request, res: NextResponse) {
  const form = await req.formData();
  const groupName = form.get("groupName");
  const groupId = form.get("groupId");
  const filePath = form.get("filePath");
  const fileName = form.get("fileName");
  console.log("groupName", groupName);
  console.log("groupId", groupId);
  console.log("filePath", filePath);
  console.log("fileName", fileName);

  try {
    const video = await prisma.videos.create({
      data: {
        fileName: groupName as string,
        url: filePath as string,
        groupId: groupId as string,
      },
      include: {
        group: true,
      },

    });
    console.log("video", video);
    return new NextResponse(JSON.stringify({ success: true, video }));
  } catch (error) {
    console.error("Error uploading file:", error);
    return new NextResponse(
      JSON.stringify({ error: "Ocurrió un error al subir el archivo" })
    );
  }
}
