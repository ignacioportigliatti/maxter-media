import prisma from "@/libs/prismadb";
import { wasabiClient } from "@/utils/wasabi/wasabiClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const createdGroup = await prisma.group.create({
      data: {
        name: data.name,
        coordinator: data.coordinator,
        school: data.school,
        entry: data.entry,
        exit: data.exit,
        agencyId: data.agency,
        agencyName: data.agencyName,
        agency: {
          connect: { id: data.agencyId }
        }
      },
      include: {
        agency: true
      }
    });
    new Promise((resolve, reject) => {
      const dummyBuffer = Buffer.from('...') || 'STRING_VALUE'
      try {

        const videoFolder = wasabiClient.putObject({
          Bucket: "maxter-media",
          Key: `media/${createdGroup.agencyName}/videos/${createdGroup.name}/`,
          Body: dummyBuffer,
        }, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else     return data;           // successful response
        })
        const photoFolder = wasabiClient.putObject({
          Bucket: "maxter-media",
          Key: `media/${createdGroup.agencyName}/fotos/${createdGroup.name}/`,
          Body: dummyBuffer,
        }, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else     return data;           // successful response
        })
      resolve(videoFolder && photoFolder)
      } catch (error) {
        reject(error)
      }
    
  })

    return NextResponse.json({ success: true, group: createdGroup });
  } catch (error) {
    console.error("Error al crear el grupo:", error);
    return NextResponse.json({ error: "Ocurrió un error al crear el grupo" });
  }
}

