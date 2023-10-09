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
        const updatedCode = await prisma.codes.update({
            where: {
                id: codeId
            },
            data: {
                expires: expirationDate
            }
        })
        NextResponse.json({ success: true, code: updatedCode })
    } catch (error) {
        console.error(error)
        NextResponse.json({ success: false, error: error })
    }
}