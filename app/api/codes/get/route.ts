import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

interface RequestBody {
    groupId: string;
}

export async function POST(request: Request) {
    const body: RequestBody = await request.json();
    const { groupId } = body;
    try {
        const groupCodes = await prisma.codes.findMany({
            where: {
                groupId: groupId
            }
        });
        return NextResponse.json({success: 'Codigos encontrados', codes: groupCodes});
    } catch (error) {
        return NextResponse.json({error: `Error al crear el codigo: ${error}`});        
    }
}