import prisma from "@/libs/prismadb";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  //Getting body
  const body: User = await request.json();
  //Extracting body
  const {email, password } = body;
  //Creating user
  try {
    // Crea un nuevo grupo con los datos del formulario

    const userList = await prisma.user.findMany();
    const userToEdit = userList.find((user) => user.email === email);


    try {
      const user = await prisma.user.update({
        where: { id: userToEdit?.id },
        data: {
          email: email,
          password: password,
          updatedAt: new Date(),
        },
      });
      


      console.log("Empresa editada exitosamente", user);
      return NextResponse.json({
        success: `${user} editado exitosamente`,
        user: user,
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
