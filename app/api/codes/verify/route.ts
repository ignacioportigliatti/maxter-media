import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { code } = body;
  try {
    const codeData = await prisma.codes.findFirst({
      where: {
        code: code,
      },
    });

    //create date.Now in this format 2021-08-31T12:00:00.000Z
    const now = new Date();

    if (codeData && codeData.expires > now) {
      try {
        const selectedGroup = await prisma.group.findFirst({
          where: {
            id: codeData.groupId as string,
          },
        });
        return NextResponse.json(
          { success: true, code: codeData, selectedGroup: selectedGroup },
          { status: 200 }
        );
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error }, { status: 500 });
      }
    } else if (codeData && codeData.expires < now) {
      const selectedGroup = await prisma.group.findFirst({
        where: {
          id: codeData.groupId as string,
        },
      });
      return NextResponse.json(
        {
          error: `El codigo expiró el ${codeData.expires.toLocaleDateString()}`,
          code: codeData,
          selectedGroup: selectedGroup,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          error:
            "No se ha encontrado el codigo en nuestra base de datos, checkea si lo escribiste bien y volve a intentar.",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
