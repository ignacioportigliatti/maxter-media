import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const groups = await prisma.group.findMany();
    return NextResponse.json(groups);
}