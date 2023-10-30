import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

interface BodyProps {
  expirationDate: Date;
  codeId: string;
}

export async function POST(request: Request) {
  const body: BodyProps = await request.json();
  const { codeId, expirationDate } = body;
  try {
    const codeData = await prisma.codes.update({
      where: {
        id: codeId,
      },
      data: {
        expires: expirationDate,
      },
    });
    return NextResponse.json(
      { success: true, codeData: codeData },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error });
  }
}
