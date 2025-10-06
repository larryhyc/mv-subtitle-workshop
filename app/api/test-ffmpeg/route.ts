import { NextResponse } from 'next/server';
import ffmpeg from 'fluent-ffmpeg';

export async function GET() {
  try {
    // 检查FFmpeg版本
    const version = await new Promise((resolve, reject) => {
      ffmpeg.getAvailableFormats((err, formats) => {
        if (err) {
          reject(err);
        } else {
          resolve('FFmpeg is available');
        }
      });
    });

    return NextResponse.json({
      success: true,
      message: version,
      availableFormats: Object.keys(ffmpeg.getAvailableFormats()).length
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

