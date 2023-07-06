import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { User } from "@prisma/client";
import bcrypt from "bcrypt"

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const createdUser: User = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
    }});

    console.log("Usuario creado correctamente");
    return NextResponse.json({ success: true, user: createdUser });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    return NextResponse.json({ error: "Ocurrió un error al crear el usuario" });
  }
}

