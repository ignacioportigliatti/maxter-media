import { authOptions } from "@/libs/authOptions";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions)
    console.log(`session: ${JSON.stringify(session)}`);
    return NextResponse.json({ authenticated: !!session})
}