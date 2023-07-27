import { Codes } from "@prisma/client";
import ReactPDF from "@react-pdf/renderer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, pdf }: { code: Codes; pdf: React.JSX.Element } = body;
    const pdfStream = await ReactPDF.renderToFile(pdf, `${__dirname}/my-doc.pdf`);

    return NextResponse.json(
      { success: true, code: code, pdf: pdfStream },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
