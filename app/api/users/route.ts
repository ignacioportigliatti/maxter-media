import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  try {
    await prisma.user.deleteMany({
      where: {
        id: String(id),
      },
    });

    return NextResponse.json({ success: true }); // Agrega la propiedad "success" a la respuesta
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    return NextResponse.json({
      error: "Ocurrió un error al eliminar el usuario",
    }); // Agrega la propiedad "error" a la respuesta
  }
}


export async function GET(request: Request) {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
}