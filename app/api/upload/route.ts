import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

const storage = new Storage({ projectId: process.env.GCLOUD_PROJECT, keyFilename: process.env.BUCKET_KEYFILE});
const bucketName = process.env.BUCKET_NAME!;

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;
  const folder = data.get('folder');

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file selected' });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const destFileName = `uploads/${folder}/${file.name}`;

    const bucket = storage.bucket(bucketName);
    const fileObj = bucket.file(destFileName);

    await fileObj.save(buffer);
    console.log('File saved');
   
    const signedUrl = await fileObj.getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
    });

    console.log(`File uploaded: ${signedUrl}`);

    return NextResponse.json({ success: true, filePath: signedUrl.toString() });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to upload file',
    });
  }
}
