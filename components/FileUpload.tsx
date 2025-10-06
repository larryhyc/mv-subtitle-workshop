'use client';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  UploadIcon,
  VideoIcon,
  FileTextIcon,
  CheckIcon,
  XIcon,
} from 'lucide-react';
import { useVideoStore } from '@/store/useVideoStore';
import { useState } from 'react';

export const FileUpload = () => {
  const {
    videoUrl,
    subtitleUrl,
    setVideoUrl,
    setVideoFile,
    setSubtitleUrl,
    setSubtitleFile,
    reset,
  } = useVideoStore();
  const [videoFileName, setVideoFileName] = useState<string>('');
  const [lrcFileName, setLrcFileName] = useState<string>('');

  const onVideoDrop = async (acceptedFiles: File[]) => {
    console.log('Video drop:', acceptedFiles);
    const videoFile = acceptedFiles.find((file) =>
      file.type.startsWith('video/')
    );

    if (videoFile) {
      console.log('Setting video file:', videoFile.name, videoFile.size);
      setVideoUrl(URL.createObjectURL(videoFile));
      setVideoFile(videoFile);
      setVideoFileName(videoFile.name);
    }
  };

  const onLrcDrop = async (acceptedFiles: File[]) => {
    console.log('LRC drop:', acceptedFiles);
    const lrcFile = acceptedFiles.find((file) => file.name.endsWith('.lrc'));

    if (lrcFile) {
      console.log('Setting LRC file:', lrcFile.name, lrcFile.size);
      const content = await lrcFile.text();
      setSubtitleUrl(content);
      setSubtitleFile(lrcFile);
      setLrcFileName(lrcFile.name);
    }
  };

  const videoDropzone = useDropzone({
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.mkv'],
    },
    onDrop: onVideoDrop,
    multiple: false,
  });

  const lrcDropzone = useDropzone({
    accept: {
      'text/plain': ['.lrc'],
    },
    onDrop: onLrcDrop,
    multiple: false,
  });

  const clearFiles = () => {
    reset();
    setVideoFileName('');
    setLrcFileName('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>上传音乐MV视频和LRC字幕文件</span>
          {(videoUrl || subtitleUrl) && (
            <button
              onClick={clearFiles}
              className="text-sm text-gray-500 cursor-pointer hover:text-red-500 flex items-center gap-1"
            >
              <XIcon className="w-4 h-4" />
              清除文件
            </button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 视频上传区域 */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <VideoIcon className="w-5 h-5" />
              音乐MV视频
            </h3>
            <div
              {...videoDropzone.getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                videoDropzone.isDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : videoUrl
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...videoDropzone.getInputProps()} />
              {videoUrl ? (
                <div className="flex flex-col items-center">
                  <CheckIcon className="w-12 h-12 text-green-500 mb-2" />
                  <p className="text-green-600 font-medium">视频已上传</p>
                  <p className="text-sm text-gray-600 mt-1">{videoFileName}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    点击或拖拽新文件替换
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <UploadIcon className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-gray-600">
                    {videoDropzone.isDragActive
                      ? '松开鼠标上传视频'
                      : '点击或拖拽视频文件到这里'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    支持 MP4, AVI, MOV, MKV 格式
                  </p>
                  <p className="text-xs text-red-500 mt-1">
                    建议文件大小不超过100MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* LRC字幕上传区域 */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <FileTextIcon className="w-5 h-5" />
              LRC字幕文件
            </h3>
            <div
              {...lrcDropzone.getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                lrcDropzone.isDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : subtitleUrl
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...lrcDropzone.getInputProps()} />
              {subtitleUrl ? (
                <div className="flex flex-col items-center">
                  <CheckIcon className="w-12 h-12 text-green-500 mb-2" />
                  <p className="text-green-600 font-medium">字幕已上传</p>
                  <p className="text-sm text-gray-600 mt-1">{lrcFileName}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    点击或拖拽新文件替换
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <UploadIcon className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-gray-600">
                    {lrcDropzone.isDragActive
                      ? '松开鼠标上传字幕'
                      : '点击或拖拽LRC文件到这里'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">支持 .lrc 格式</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 文件状态提示 */}
        {videoUrl && subtitleUrl && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <CheckIcon className="w-5 h-5" />
              <span className="font-medium">文件准备就绪！</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              视频和字幕文件都已上传，现在可以开始生成带字幕的视频了。
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
