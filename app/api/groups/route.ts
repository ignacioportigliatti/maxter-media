import prisma from "@/libs/prismadb";
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

    await prisma.codes.deleteMany({
      where: {
        groupId: String(id),
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
  const groups = await prisma.group.findMany(
    {
      include: {
        agency: true,
      }
    }
  );
  return NextResponse.json(groups);
}
