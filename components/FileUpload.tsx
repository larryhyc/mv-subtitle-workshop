'use client';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadIcon } from 'lucide-react';
import { useVideoStore } from '@/store/useVideoStore';

export const FileUpload = () => {
  const { setVideoUrl, setSubtitleUrl } = useVideoStore(); // 只使用存在的方法

  const onDrop = async (acceptedFiles: File[]) => {
    const videoFile = acceptedFiles.find((file) =>
      file.type.startsWith('video/')
    );
    const lrcFile = acceptedFiles.find((file) => file.name.endsWith('.lrc'));

    if (videoFile) {
      setVideoUrl(URL.createObjectURL(videoFile)); // 更新视频 URL
    }

    if (lrcFile) {
      const content = await lrcFile.text();
      setSubtitleUrl(content);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'video/*': ['.mp4'],
      'text/plain': ['.lrc'],
    },
    onDrop,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>上传视频和字幕文件</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row gap-4">
          {/* 视频上传区域 */}
          <div
            {...getRootProps()}
            className={`flex-1 border-2 border-dashed rounded-lg p-8 text-center ${
              isDragActive ? 'border-primary' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">
              {isDragActive ? '松开鼠标上传文件' : '拖拽视频文件到这里'}
            </p>
          </div>

          {/* 字幕上传区域 */}
          <div
            {...getRootProps()}
            className={`flex-1 border-2 border-dashed rounded-lg p-8 text-center ${
              isDragActive ? 'border-primary' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">
              {isDragActive ? '松开鼠标上传文件' : '拖拽字幕文件 (.lrc) 到这里'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
