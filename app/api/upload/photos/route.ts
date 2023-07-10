import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(req: Request, res: NextResponse) {
  const form = await req.formData();
  const groupId = form.get("groupId");
  const fileIds = form.getAll("fileIds");

  console.log("groupId", groupId);
  console.log("fileIds", fileIds);

  try {
    const photo = await prisma.group.update({
      where: { id: groupId as string },
      data: {
        photosIds: {
          push: fileIds as [string],
        },
      },
    });
    console.log("photo", photo);
    return new NextResponse(JSON.stringify({ success: true, photo }));
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
  const fileIds = url.searchParams.get("fileIds");

  try {
    const photosArray = await prisma.group.findMany({
      where: {
        id: groupId as string,
      },
      select: {
        photosIds: true,
      },
    });

    const updatedPhotos = photosArray[0].photosIds.filter(
      (photo) => photo !== fileIds
    );

    const photo = await prisma.group.update({
      where: { id: groupId as string },
      data: {
        photosIds: {
          set: updatedPhotos,
        },
      },
    });
    console.log(`Photos deleted from group ${groupId}`)
    return new NextResponse(JSON.stringify({ success: true, photo }));
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
    const photos = await prisma.group.findMany({
      where: {
        name: groupName,
      },
      select: {
        photosIds: true,
      },
    });
    console.log(`photos from ${groupName}: ${photos}`);
    return NextResponse.json(photos);
  } else {
    const photos = await prisma.group.findMany({
      select: {
        photosIds: true,
      },
    });
    console.log(`photos: ${photos}`);
    return NextResponse.json(photos);
  }
}
