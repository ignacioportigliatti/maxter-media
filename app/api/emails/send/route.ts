import prisma from "@/libs/prismadb";
import { ContactQuery } from "@prisma/client";
import { NextResponse } from "next/server";
import { Resend } from "resend";

interface SendEmailProps {
  from: string;
  to: string;
  subject: string;
  response: string;
  query: ContactQuery;
}

export async function POST (request: Request) {
  const body = (await request.json()) as SendEmailProps;
  const { from, to, subject, response, query } = body;
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  try {
    const data = await resend.emails.send({
      from: from,
      to: to,
      subject: subject,
      html: response,
    });
    if (data) {
      try {
        await prisma.contactQuery.update({
          where: {
            id: query.id,
          },
          data: {
            replied: true,
            reply: response,
          },
        });
        console.log(`Email sent to ${to}, database updated.`);
      } catch (error) {
        console.error(error);
      }
      return NextResponse.json({ success: true, data: data });
    } else {
      return NextResponse.json({ success: false, data: data });
    }
  } catch (error) {
    console.error(error);
    NextResponse.json({ success: false, error: error });
  }
};
