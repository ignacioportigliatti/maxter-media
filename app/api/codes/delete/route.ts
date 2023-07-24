import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const { codeId } = body;
    try {
        const groupCodes = await prisma.codes.deleteMany({
            where: {
                id: codeId
            }
        });
        return NextResponse.json({success: 'Codigos eliminados', codes: groupCodes});
    } catch (error) {
        return NextResponse.json({error: `Error al crear el codigo: ${error}`});        
    }
}