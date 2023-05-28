import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;
  const folder = data.get("folder");

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadsDir = join(process.cwd(), `public/uploads/${folder}`);
  const fileName = file.name;
  const filePath = join(uploadsDir, fileName);
  const baseDir = join(process.cwd(), "public/");
  const trimmedUploadPath = filePath.substring(baseDir.length);

  try {
    const uploadsDirExists = existsSync(uploadsDir);

    if (!uploadsDirExists) {
      try {
        console.log(`Creating uploads directory: ${uploadsDir}`);
        await mkdir(uploadsDir, { recursive: true });
      } catch (error) {
        console.error("Error creating uploads directory:", error);
        return NextResponse.json({
          success: false,
          error: "Failed to create folder",
        });
      }
    }

    try {
      console.log(`Writing file: ${filePath}`);
      await writeFile(filePath, buffer);
    } catch (error) {
      console.error("Error writing file:", error);
      return NextResponse.json({
        success: false,
        error: "Failed to write file",
      });
    }

    console.log(`File uploaded: ${trimmedUploadPath}`);

    return NextResponse.json({ success: true, filePath: trimmedUploadPath });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to upload file",
    });
  }
}
