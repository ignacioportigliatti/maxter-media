import axios from "axios";
import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(request: Request) {
  const body = await request.json();
  const { filePath, file } = body;
  // save file on public local folder using fs

  const uploadPath = path.join(process.cwd(), `public/uploads/${filePath}`);
  const uploadDir = path.join(
    process.cwd(),
    `public/uploads/${filePath.split("/").slice(0, -1).join("/")}`
  );

  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const buffer = Buffer.from(file.data);
    fs.writeFileSync(uploadPath, buffer);
    
    const isLocalDevelopment = request.headers.get("host")?.includes('localhost'); // Cambiar si es diferente
    const protocol = isLocalDevelopment ? "http" : "https";

    const baseUrl = `${protocol}://${request.headers.get("host")}`;

    const publicPath = path.relative(path.join(process.cwd(), "public"), uploadPath);
    const fileUrlOnServer = `${baseUrl}/${publicPath}`;

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      uploadPath: fileUrlOnServer,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: `Error: ${error}` });
  }
}
