import prisma from "@/app/libs/prismadb";
import { Group } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  //Getting body
  const body: Group = await request.json();
  //Extracting body
  const { name, coordinator, school, entry, exit, agencyId, agencyName } = body;
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
          agencyId: agencyId,
          agencyName: agencyName,
        },
      });
      const checkAgencyChange: any = async () => {
        if (groupToEdit?.agencyId !== agencyId) {



          await prisma.agency.update({
            where: { id: agencyId as string },
            data: {
              groupIds: {
                push: groupToEdit?.id,
              },
            },
          });
          

          const oldAgencyGroupIds = await prisma.agency.findUnique({
            where: { id: groupToEdit?.agencyId as string },
            select: { groupIds: true },
          });

          await prisma.agency.update({
            where: { id: groupToEdit?.agencyId as string },
            data: {
              groupIds: {
                set: oldAgencyGroupIds?.groupIds.filter(
                  (id) => id !== group.id
                ),
              },
            },
          });
          
        }
      };

      const agency = await checkAgencyChange();

      console.log("Empresa editada exitosamente", group, agency);
      return NextResponse.json({
        success: `${group} editado exitosamente, ${agency} actualizada con el grupo}`,
        group: group,
        agency: agency,
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
