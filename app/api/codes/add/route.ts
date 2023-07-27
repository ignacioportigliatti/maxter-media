import { CodesGeneratorForm } from "@/components/codes/CodesGenerator";
import prisma from "@/libs/prismadb";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import QRCode from "qrcode";


interface RequestBody {
    formData: CodesGeneratorForm;
    groupId: string;
}

export async function POST(request: Request) {
    const body: RequestBody = await request.json();
    const { formData, groupId } = body;
    try {
        const selectedGroup = await prisma.group.findUnique({
            where: {
                id: groupId
            }
        });
        if (!selectedGroup) {
            return NextResponse.json({error: 'No se encontró el grupo'});
        }

        const formattedCode = `${selectedGroup.agencyName}-${selectedGroup.name.slice(1,5)}-${randomBytes(2).toString('hex').toUpperCase()}`.toUpperCase();
        const generateQrCode = async (text: string) => {
            try {
                return await QRCode.toDataURL(text);
            } catch (error) {
                return error;
            }
        }
        const qrCode = await generateQrCode(`https://localhost:3000/client?code=${formattedCode}`);
       
        const expires = new Date();
        expires.setDate(expires.getDate() + 30);
            
        const createdCode = await prisma.codes.create({
            data: {
                code: formattedCode,
                included: formData.included,
                optional: formData.optional,
                type: formData.type,
                used: false,
                groupId: groupId,
                qrCode: qrCode as string,
                expires: expires
            },
            include: {
                group: true
            }
        });
        return NextResponse.json({success: 'Codigo creado y guardado en la base de datos exitosamente', createdCode: createdCode});
    } catch (error) {
        return NextResponse.json({error: `Error al crear el codigo: ${error}`});        
    }
}
