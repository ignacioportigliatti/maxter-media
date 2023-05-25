import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { master, coordinator, school, entry, exit, agency, agencyId, agencyName } = body;

  try {
    const group = await prisma.group.create({
      data: {
        master: master,
        coordinator: coordinator,
        school: school,
        entry: entry,
        exit: exit,
        agency: {
          connect: { id: String(agencyId) },
        },
        agencyName: agencyName,
      },
      include: {
        agency: true,
      },
    });

    console.log("Nuevo grupo creado:", group);
    
    return NextResponse.json({ success: true, data: group }); // Incluye la propiedad 'success' en la respuesta
    
  } catch (error) {
    console.error("Error al crear el grupo:", error);
    return NextResponse.json({ success: false, error: "Error al crear el grupo" }); // Incluye la propiedad 'success' en la respuesta
  }
}
