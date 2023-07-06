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
    }});

   

    console.log("Usuario creado correctamente");
    return NextResponse.json({ success: true, user: createdUser });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    return NextResponse.json({ error: "Ocurrió un error al crear el usuario" });
  }
}

