import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  try {
    await prisma.group.deleteMany({
      where: {
        id: String(id),
      },
    });

    await prisma.agency.updateMany({
      where: {
        groupIds: { has: String(id) },
      },
      data: {
        groupIds: { set: [] },
      },
    });

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