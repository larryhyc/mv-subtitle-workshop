'use client';

import { FileUpload } from '@/components/FileUpload';
import { VideoEditor } from '@/components/VideoEditor';
import { UsageGuide } from '@/components/UsageGuide';
import { LrcSearch } from '@/components/LrcSearch';
import { Toaster } from '@/components/ui/sonner';

const Page = () => {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* 页面标题和说明 */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">音乐MV字幕添加工具</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              上传你的音乐MV视频和LRC字幕文件，我们将自动为你的视频添加字幕，让你轻松制作带字幕的音乐视频。
            </p>
          </div>

          {/* 使用说明 */}
          <UsageGuide />

          {/* 文件上传区域 */}
          <FileUpload />

          {/* LRC文件搜索区域 */}
          <LrcSearch />

          {/* 视频编辑区域 */}
          <VideoEditor />
        </div>
      </main>
      <Toaster richColors position="top-center" />
    </div>
  );
};

export default Page;
