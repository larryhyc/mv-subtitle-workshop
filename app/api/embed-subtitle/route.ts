import { NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

export const dynamic = 'force-dynamic'; // 确保动态路由

// 解析 .lrc 文件
const parseLrc = (content: string): { startTime: number; text: string }[] => {
  const lines = content.split('\n');
  const result: { startTime: number; text: string }[] = [];

  for (const line of lines) {
    // 匹配时间标签（例如 [00:54.04]）
    const match = line.match(/^\[(\d{2}):(\d{2})\.(\d{2})\](.*)/);
    if (match) {
      const [, mm, ss, xx, text] = match;
      const startTime =
        parseInt(mm) * 60 * 1000 + // 分钟转毫秒
        parseInt(ss) * 1000 + // 秒转毫秒
        parseInt(xx) * 10; // 百分之一秒转毫秒
      result.push({ startTime, text: text.trim() });
    }
  }

  return result;
};

// 转换为 .srt 格式
const lrcToSrt = (lrcLines: { startTime: number; text: string }[]): string => {
  let srtContent = '';
  lrcLines.forEach((line, index) => {
    const nextLine = lrcLines[index + 1];
    const startTime = formatTime(line.startTime);
    const endTime = nextLine
      ? formatTime(nextLine.startTime)
      : formatTime(line.startTime + 2000); // 默认显示2秒
    srtContent += `${index + 1}\n${startTime} --> ${endTime}\n${line.text}\n\n`;
  });
  return srtContent;
};

// 格式化时间（hh:mm:ss,mmm）
const formatTime = (ms: number): string => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )}:${String(seconds).padStart(2, '0')},${String(milliseconds).padStart(
    3,
    '0'
  )}`;
};

export async function POST(request: Request) {
  try {
    const { videoFile, subtitleFile } = await request.json();
    if (!videoFile || !subtitleFile) {
      return NextResponse.json(
        { error: 'Missing video or subtitle file' },
        { status: 400 }
      );
    }

    // 保存文件到临时目录
    const tempDir = join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // 生成随机文件名
    const generateRandomName = () =>
      Math.random().toString(36).substring(2, 15);
    const videoPath = join(
      tempDir,
      `video_${Date.now()}_${generateRandomName()}.mp4`
    );
    const outputPath = join(tempDir, `output_${Date.now()}.mp4`);

    // 1. 处理视频文件（Blob URL）
    // 从 Blob URL 获取视频数据
    const videoBlob = await fetch(videoFile).then((res) => res.blob());
    const videoBuffer = await videoBlob.arrayBuffer();
    await writeFile(videoPath, Buffer.from(videoBuffer));

    // 2. 处理字幕文件（直接是 .lrc 内容）
    const lrcLines = parseLrc(subtitleFile);
    const srtContent = lrcToSrt(lrcLines);

    // 保存 .srt 文件
    const srtPath = join(tempDir, `subtitle_${Date.now()}.srt`);
    await writeFile(srtPath, srtContent);

    // 使用 fluent-ffmpeg 嵌入字幕
    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .outputOptions('-vf', `subtitles=${srtPath}`)
        .save(outputPath)
        .on('end', resolve)
        .on('error', (err) => {
          console.error('FFmpeg error:', err);
          reject(err);
        });
    });

    // 读取处理后的视频文件
    const outputFile = await fs.promises.readFile(outputPath, {
      encoding: null,
    });

    // 确保返回的是标准的 ArrayBuffer
    const arrayBuffer = new ArrayBuffer(outputFile.length);
    const view = new Uint8Array(arrayBuffer);
    view.set(outputFile);

    // 清理临时文件
    await Promise.all([unlink(videoPath), unlink(srtPath), unlink(outputPath)]);

    // 返回视频文件
    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': 'attachment; filename="output.mp4"',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
