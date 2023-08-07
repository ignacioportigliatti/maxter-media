import ThumbnailGenerator from 'video-thumbnail-generator';

import { NextResponse } from "next/server";
import { wasabiClient } from "@/utils/wasabi/wasabiClient";

export async function POST(req: Request) {
  const body = await req.json();
  const { inputFilePath, wasabiFilePath } = body;

  try {
    const thumbnailUrl = await new Promise((resolve, reject) => {
      const tg = new ThumbnailGenerator({
        sourcePath: inputFilePath,
        thumbnailPath: "/tmp",
    });
    tg.generateOneByPercentCb(90).then(console.log).catch(console.log);
  });
      return NextResponse.json({success: true, thumbnailUrl: thumbnailUrl});
  } catch (error) {
      return NextResponse.json({success: false, error: error});
  }
}
