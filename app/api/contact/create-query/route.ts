import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

interface ContactQueryParams {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
    code: string;
    selectedAgency: string;
    selectedGroup: string;
}

export async function POST (request: Request) {
    const body: ContactQueryParams = await request.json();
    const { firstName, lastName, email, phone, message, code, selectedAgency, selectedGroup } = body;

    try {
        await prisma.contactQuery.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                message,
                currentCode: code,
                selectedAgency,
                selectedGroup
            }
        })
        const contactQueryId = await prisma.contactQuery.findFirst({
            where: {
                currentCode: code
            },
            select: {
                id: true
            }
        })
        return NextResponse.json({ success: true, queryId: contactQueryId })
    } catch (error) {
        
    }
}