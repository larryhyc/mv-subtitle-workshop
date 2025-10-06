'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DownloadIcon, FileTextIcon, VideoIcon, PlayIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const UsageGuide = () => {
  const downloadExampleLrc = () => {
    const link = document.createElement('a');
    link.href = '/example.lrc';
    link.download = 'example.lrc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>使用说明</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 步骤说明 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <VideoIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-medium">1. 上传视频</h3>
            <p className="text-sm text-gray-600">
              上传你的音乐MV视频文件，支持MP4、AVI、MOV、MKV格式
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FileTextIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-medium">2. 上传字幕</h3>
            <p className="text-sm text-gray-600">
              上传LRC格式的字幕文件，支持标准时间格式
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <PlayIcon className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-medium">3. 生成下载</h3>
            <p className="text-sm text-gray-600">
              点击处理按钮，等待完成后下载带字幕的视频
            </p>
          </div>
        </div>

        {/* LRC格式说明 */}
        <div className="p-4 rounded-lg">
          <h4 className="font-medium mb-2">LRC字幕文件格式说明</h4>
          <p className="text-sm text-gray-600 mb-3">
            LRC文件是歌词文件格式，每行包含时间标签和歌词内容。时间格式为
            [分:秒.毫秒]。
          </p>
          <div className=" p-3 rounded border text-sm font-mono">
            <div>[00:00.50]这是第一句歌词</div>
            <div>[00:03.20]这是第二句歌词</div>
            <div>[00:06.80]这是第三句歌词</div>
          </div>
        </div>

        {/* 示例文件下载 */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900">需要示例LRC文件？</h4>
              <p className="text-sm text-blue-700 mt-1">
                下载示例LRC文件来测试工具功能
              </p>
            </div>
            <Button
              onClick={downloadExampleLrc}
              variant="outline"
              size="sm"
              className="cursor-pointer"
            >
              <DownloadIcon className="w-4 h-4 mr-2" />
              下载示例
            </Button>
          </div>
        </div>

        {/* 注意事项 */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">注意事项</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• 确保LRC文件的时间格式正确</li>
            <li>• 视频文件大小建议不超过500MB</li>
            <li>• 处理时间取决于视频长度和复杂度</li>
            <li>• 字幕将显示在视频底部中央位置</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
