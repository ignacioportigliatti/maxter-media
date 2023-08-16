import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const createdGroup = await prisma.group.create({
      data: {
        name: data.name,
        coordinator: data.coordinator,
        school: data.school,
        entry: data.entry,
        exit: data.exit,
        agencyId: data.agency,
        agencyName: data.agencyName,
        agency: {
          connect: { id: data.agencyId }
        }
      },
      include: {
        agency: true
      }
    });

   

    console.log("Grupo creado correctamente");
    return NextResponse.json({ success: true, group: createdGroup });
  } catch (error) {
    console.error("Error al crear el grupo:", error);
    return NextResponse.json({ error: "Ocurrió un error al crear el grupo" });
  }
}

