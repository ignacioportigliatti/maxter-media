import prisma from "@/libs/prismadb";
import { Group } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  //Getting body
  const body: Group = await request.json();
  //Extracting body
  const { id, name, coordinator, school, entry, exit, agencyId, agencyName } =
    body;
  //Creating group
  try {
    // Crea un nuevo grupo con los datos del formulario

    const groupList = await prisma.group.findMany({
      include: {
        agency: true,
      },
    });
    const groupToEdit = groupList.find((group) => group.name === name);

    try {
      const group = await prisma.group.update({
        where: { id: groupToEdit?.id },
        data: {
          name: name,
          coordinator: coordinator,
          school: school,
          entry: entry,
          exit: exit,
          agencyId: agencyId,
          agencyName: agencyName,
        },
        include: {
          agency: true,
        },
      });

      return NextResponse.json({
        success: `${group} editado exitosamente, ${group.agency?.name} actualizada con el grupo}`,
        group: group,
        agency: group.agency?.name,
      });
    } catch (error) {
      console.log("Error al editar grupo", error);
      return NextResponse.json({
        error: `Error al editar grupo ${error}`,
      });
    }
  } catch (error) {
    console.log("Error al crear grupo", error);
    return NextResponse.json({
      error: `Error al crear grupo ${error}`,
    });
  }
}
