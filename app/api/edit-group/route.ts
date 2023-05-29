import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  //Getting body
  const body = await request.json();
  //Extracting body
  const { name, coordinator, school, entry, exit, agency } = body;
  //Creating group
  try {
    // Crea un nuevo grupo con los datos del formulario

    const groupList = await prisma.group.findMany();
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
            agency: agency,

          },
        });

        console.log("Empresa editada exitosamente", group);
        return NextResponse.json({
          success: "Empresa editada exitosamente",
          group: group,
        });
      } catch (error) {
        console.log(`Error al editar la empresa: ${error}`);
        return NextResponse.json({ error: "Error al editar la empresa" });
      }

  } catch (error) {
    console.error("Error al editar la empresa:", error);
    return NextResponse.json({ error: "Error al editar la empresa" });
  }
}
