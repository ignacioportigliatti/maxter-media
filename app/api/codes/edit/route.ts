import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

interface BodyProps {
    expirationDate: Date;
    codeId: string;
}

export async function POST(request: Request) {
    const body = await request.json();
    try {
        await prisma.codes.update({
            where: {
                id: body.codeId
            },
            data: {
                expires: body.expirationDate
            }
        })
        NextResponse.json({ success: true })
    } catch (error) {
        NextResponse.json({ success: false, error: error })
    }
}