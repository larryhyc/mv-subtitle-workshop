import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  try {
    const { lrcContent } = await request.json();

    if (!lrcContent) {
      return NextResponse.json({ error: '缺少LRC内容' }, { status: 400 });
    }

    // 解析LRC内容
    const lines = lrcContent.split('\n');
    const result: { startTime: number; text: string }[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      // 匹配时间格式 [mm:ss.xx] 或 [m:ss.xx]
      let match = trimmedLine.match(/^\[(\d{1,2}):(\d{2})\.(\d{2,3})\](.*)/);

      if (!match) {
        // 尝试不带毫秒的格式
        match = trimmedLine.match(/^\[(\d{1,2}):(\d{2})\](.*)/);
        if (match) {
          const [, mm, ss, text] = match;
          const startTime = parseInt(mm) * 60 * 1000 + parseInt(ss) * 1000;
          const cleanText = text.trim();
          if (cleanText) {
            result.push({ startTime, text: cleanText });
          }
        }
      } else {
        const [, mm, ss, xx, text] = match;
        const startTime =
          parseInt(mm) * 60 * 1000 + // 分钟转毫秒
          parseInt(ss) * 1000 + // 秒转毫秒
          parseInt(xx.padEnd(3, '0')) * (xx.length === 2 ? 10 : 1); // 处理两位或三位毫秒

        const cleanText = text.trim();
        if (cleanText) {
          result.push({ startTime, text: cleanText });
        }
      }
    }

    // 按时间排序
    const lrcLines = result.sort((a, b) => a.startTime - b.startTime);

    // 转换为SRT格式
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

    let srtContent = '';
    lrcLines.forEach((line, index) => {
      const nextLine = lrcLines[index + 1];
      const startTime = formatTime(line.startTime);
      const endTime = nextLine
        ? formatTime(nextLine.startTime)
        : formatTime(line.startTime + 3000);

      const cleanText = line.text.replace(/[<>]/g, '').trim();

      if (cleanText && cleanText.length > 0) {
        srtContent += `${
          index + 1
        }\n${startTime} --> ${endTime}\n${cleanText}\n\n`;
      }
    });

    // 保存测试SRT文件
    const tempDir = join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const srtPath = join(tempDir, `test_subtitle_${Date.now()}.srt`);
    await writeFile(srtPath, srtContent, 'utf8');

    return NextResponse.json({
      success: true,
      lrcLines: lrcLines.length,
      srtContent,
      srtPath,
      fileSize: fs.statSync(srtPath).size,
    });
  } catch (error) {
    console.error('SRT测试错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

