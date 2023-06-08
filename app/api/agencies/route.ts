import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id"); // Obtén el ID de la empresa desde los parámetros de la URL

  try {
    // Elimina la empresa de la base de datos utilizando Prisma
    await prisma.agency.deleteMany({
      where: {
        id: String(id),
      },
    });

    console.log("Empresa eliminada correctamente");
    return NextResponse.json({ success: true }); // Agrega la propiedad "success" a la respuesta
  } catch (error) {
    console.error("Error al eliminar la empresa:", error);
    return NextResponse.json({ error: "Ocurrió un error al eliminar la empresa" }); // Agrega la propiedad "error" a la respuesta
  }
}


export async function GET(request: Request) {
  const agencies = await prisma.agency.findMany();
  return NextResponse.json(agencies);
}
