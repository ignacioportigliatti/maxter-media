import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(req: Request, res: NextResponse) {
  const form = await req.formData();
  const groupId = form.get("groupId");
  const fileId = form.get("fileId");

  console.log("groupId", groupId);
  console.log("fileId", fileId);

  try {
    const video = await prisma.group.update({
      where: { id: groupId as string },
      data: {
        videoIds: {
          push: fileId as string,
        },
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

export async function DELETE(req: Request, res: NextResponse) {
  const url = new URL(req.url);
  const groupId = url.searchParams.get("groupId");
  const fileId = url.searchParams.get("fileId");

  try {
    const videosArray = await prisma.group.findMany({
      where: {
        id: groupId as string,
      },
      select: {
        videoIds: true,
      },
    });

    const updatedVideos = videosArray[0].videoIds.filter(
      (video) => video !== fileId
    );

    const video = await prisma.group.update({
      where: { id: groupId as string },
      data: {
        videoIds: {
          set: updatedVideos,
        },
      },
    });
    console.log(`Video ${fileId} deleted from group ${groupId}`)
    return new NextResponse(JSON.stringify({ success: true, video }));
  } catch (error) {
    console.error("Error uploading file:", error);
    return new NextResponse(
      JSON.stringify({ error: "Ocurrió un error al subir el archivo" })
    );
  }
}

export async function GET(request: Request) {
  const req = await request.json();
  const groupName = req.groupName as string;
  if (groupName !== "") {
    const videos = await prisma.group.findMany({
      where: {
        name: groupName,
      },
      select: {
        videoIds: true,
      },
    });
    console.log(`videos from ${groupName}: ${videos}`);
    return NextResponse.json(videos);
  } else {
    const videos = await prisma.group.findMany({
      select: {
        videoIds: true,
      },
    });
    console.log(`videos: ${videos}`);
    return NextResponse.json(videos);
  }
}
