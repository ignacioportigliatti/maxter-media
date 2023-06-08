import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  //Getting body
  const body = await request.json();
  //Extracting body
  const { name, location, phone, email, logoSrc, } = body;
  //Creating group
  try {
    // Crea un nuevo grupo con los datos del formulario

    const agenciesList = await prisma.agency.findMany();
    const agencyToEdit = agenciesList.find((agency) => agency.name === name);
    
      try {
        const agency = await prisma.agency.update({
        where: { id: agencyToEdit?.id },
          data: {
            name: name,
            location: location,
            phone: phone,
            email: email,
            logoSrc: logoSrc,
          },
        });

        console.log("Empresa editada exitosamente", agency);
        return NextResponse.json({
          success: "Empresa editada exitosamente",
          agency: agency,
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
