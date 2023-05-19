import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  //Getting body
  const body = await request.json();
  //Extracting body
  const { name, location, phone, email } = body;
  //Creating group
  try {
    // Crea un nuevo grupo con los datos del formulario
    const agency = await prisma.agency.create({
      data: {
        name: name,
        location: location,
        phone: phone,
        email: email,
      },
    });

    console.log("Nueva empresa creada:", agency);
    return NextResponse.json(agency);
    // Realiza cualquier acción adicional o muestra un mensaje de éxito
  } catch (error) {
    console.error("Error al crear el grupo:", error);
    // Maneja el error de manera adecuada, muestra un mensaje de error, etc.
}
}
