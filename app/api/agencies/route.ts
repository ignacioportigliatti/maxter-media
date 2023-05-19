import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const agencies = await prisma.agency.findMany();
    return NextResponse.json(agencies);
}

