import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  try {
    

    const agencyIdArray = await prisma.group.findMany({
      where: {
        id: String(id),
      },
      select: {
        agencyId: true,
      },
    });

    const agencyId = agencyIdArray[0].agencyId; 

    const groupIdsArray = await prisma.agency.findMany({
      where: {
        id: agencyId as string,
      },
      select: {
        groupIds: true,
      },
    });

    const updatedGroupIds = groupIdsArray[0].groupIds.filter(
      (group) => group !== id
    );

    await prisma.agency.updateMany({
      where: {
        id: agencyId as string,
      },
      data: {
        groupIds: { set: updatedGroupIds },
      },
    });

    console.log(`Group ${id} deleted from agency ${agencyId}`);

    await prisma.group.deleteMany({
      where: {
        id: String(id),
      },
    });

    console.log(`Group ${id} deleted`);

    return NextResponse.json({ success: true }); // Agrega la propiedad "success" a la respuesta
  } catch (error) {
    console.error("Error al eliminar el grupo:", error);
    return NextResponse.json({
      error: "Ocurrió un error al eliminar el grupo",
    }); // Agrega la propiedad "error" a la respuesta
  }
}

export async function GET(request: Request) {
  const groups = await prisma.group.findMany();
  return NextResponse.json(groups);
}
