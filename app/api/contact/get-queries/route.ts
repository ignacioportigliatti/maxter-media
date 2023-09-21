import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET () {
    try {
        const queries = await prisma.contactQuery.findMany();
        return NextResponse.json({ success: true, queries })
    } catch (error) {
        return NextResponse.json({ error: true, errorDetails: error })
    }
}