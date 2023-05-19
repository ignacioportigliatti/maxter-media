import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  //Getting body
  const body = await request.json();
  //Extracting body
  const { master, coordinator, school, entry, exit, agency } = body;
  //Creating group
  try {
    // Crea un nuevo grupo con los datos del formulario
    const group = await prisma.group.create({
      data: {
        master: master,
        coordinator: coordinator,
        school: school,
        entry: entry,
        exit: exit,
        agency: {
          connect: { id: String(agency) }, // Conecta el grupo a la agencia existente por su ID
        },
      },
      include: {
        agency: true, // Incluye la agencia relacionada en la respuesta
      },
    });

    console.log("Nuevo grupo creado:", group);
    return NextResponse.json(group);
    // Realiza cualquier acción adicional o muestra un mensaje de éxito
  } catch (error) {
    console.error("Error al crear el grupo:", error);
    // Maneja el error de manera adecuada, muestra un mensaje de error, etc.
}
}
