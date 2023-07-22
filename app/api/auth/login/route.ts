import prisma from "@/libs/prismadb";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";


interface RequestBody {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  const body: RequestBody = await request.json();
  console.log(`body: ${JSON.stringify(body)}`);
  const user = await prisma.user.findFirst({
    where: {
      email: body.email,
    },
  });
  console.log(`user: ${JSON.stringify(user)}`);

  try {
    if (user && (await bcrypt.compare(body.password, user.password))) {
      try {
        return NextResponse.json({
          success: true,
          user
        });
      } catch (error) {
        
      }
    } else {
      return NextResponse.json({
        success: false,
        user: null,
        error: "Invalid credentials",
      });
    }
  } catch (error) {
    console.error(`Error: ${error}`);
    return NextResponse.json({
        success: false,
        user: null,
        error: "Invalid credentials",
      });
  }

}
