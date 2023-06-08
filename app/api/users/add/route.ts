import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { User } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const timestamp = Date.now();
    const createdUser: User = await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        createdAt: new Date(timestamp),
        updatedAt: new Date(timestamp),
    }});

    // Agrega el grupo a la agencia

    console.log("Grupo creado correctamente");
    return NextResponse.json({ success: true, user: createdUser });
  } catch (error) {
    console.error("Error al crear el grupo:", error);
    return NextResponse.json({ error: "Ocurrió un error al crear el grupo" });
  }
}

