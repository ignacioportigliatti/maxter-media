import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  //Getting body
  const body = await request.json();
  //Extracting body
  const { name, location, phone, email, logoSrc } = body;
  //Creating group
  try {
    // Crea un nuevo grupo con los datos del formulario

    const agenciesList = await prisma.agency.findMany();
    const agencyExists = agenciesList.find((agency) => agency.name === name);
    if (!agencyExists) {
      try {
        const agency = await prisma.agency.create({
          data: {
            name: name,
            location: location,
            phone: phone,
            email: email,
            logoSrc: logoSrc,
          },
        });

        console.log("Nueva empresa creada:", agency);
        return NextResponse.json({
          success: "Empresa creada exitosamente",
          agency: agency,
        });
      } catch (error) {
        console.log(`Error al crear la empresa: ${error}`);
        return NextResponse.json({ error: "Error al crear la empresa" });
      }
    } else {
      console.log(`La empresa ya existe`);
      return NextResponse.json({ error: "La empresa ya existe" });
    }
  } catch (error) {
    console.error("Error al crear el grupo:", error);
    return NextResponse.json({ error: "Error al crear el grupo" });
  }
}
