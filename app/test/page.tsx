'use client';

import { useState } from 'react';

export default function TestPage() {
  const [result, setResult] = useState<string>('');
  const [lrcContent, setLrcContent] = useState<string>(`[00:00.50]这是第一句歌词
[00:03.20]这是第二句歌词
[00:06.80]这是第三句歌词
[00:10.30]这是第四句歌词
[00:14.00]这是第五句歌词`);

  const testFFmpeg = async () => {
    try {
      const response = await fetch('/api/test-ffmpeg');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  const testSRT = async () => {
    try {
      const response = await fetch('/api/test-srt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lrcContent }),
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">测试页面</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">FFmpeg 测试</h2>
        <button
          onClick={testFFmpeg}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          测试 FFmpeg
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">SRT 转换测试</h2>
        <div>
          <label className="block text-sm font-medium mb-2">LRC 内容:</label>
          <textarea
            value={lrcContent}
            onChange={(e) => setLrcContent(e.target.value)}
            className="w-full h-32 p-2 border rounded"
            placeholder="输入LRC内容..."
          />
        </div>
        <button
          onClick={testSRT}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          测试 SRT 转换
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">测试结果</h2>
        <pre className="p-4 bg-gray-100 rounded text-sm overflow-auto max-h-96">
          {result}
        </pre>
      </div>
    </div>
  );
}
