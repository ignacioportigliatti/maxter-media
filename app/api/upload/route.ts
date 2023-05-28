import { writeFile, mkdir } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadsDir = join(process.cwd(), 'public/uploads');
  const fileName = file.name;
  const filePath = join(uploadsDir, fileName);

  try {
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(filePath, buffer);

    console.log(`File uploaded: ${filePath}`);

    return NextResponse.json({ success: true, filePath }); // Retornamos el filePath en la respuesta
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload file' });
  }
}
