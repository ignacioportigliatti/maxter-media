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

        if (codeData) {
          const selectedGroup = await prisma.group.findFirst({
            where: {
              id: codeData.groupId as string,
            },
          });
            return NextResponse.json({ success: true, code: codeData, selectedGroup:selectedGroup }, { status: 200 });
        }
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
