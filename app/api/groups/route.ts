import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
    const url = new URL(request.url);
    const id = url.searchParams.get("id"); // Obtén el ID de la empresa desde los parámetros de la URL
  
    try {
      // Elimina la empresa de la base de datos utilizando Prisma
      await prisma.group.deleteMany({
        where: {
          id: String(id),
        },
      });
  
      console.log("Grupo eliminado correctamente");
      return NextResponse.json({ success: true }); // Agrega la propiedad "success" a la respuesta
    } catch (error) {
      console.error("Error al eliminar el grupo:", error);
      return NextResponse.json({ error: "Ocurrió un error al eliminar el grupo" }); // Agrega la propiedad "error" a la respuesta
    }
  }

export async function GET(request: Request) {
    const groups = await prisma.group.findMany();
    return NextResponse.json(groups);
}