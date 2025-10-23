'use client';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useVideoStore } from '@/store/useVideoStore';
import {
  PlayIcon,
  DownloadIcon,
  LoaderIcon,
  AlertCircleIcon,
} from 'lucide-react';

export const VideoEditor = () => {
  const {
    videoUrl,
    videoFile,
    subtitleUrl,
    subtitleFile,
    progress,
    isProcessing,
    processedVideoUrl,
    error,
    setProgress,
    setIsProcessing,
    setProcessedVideoUrl,
    setError,
  } = useVideoStore();

  const handleProcess = async () => {
    console.log('handleProcess called', { videoFile, subtitleFile });

    if (!videoFile || !subtitleFile) {
      console.log('Missing files:', {
        videoFile: !!videoFile,
        subtitleFile: !!subtitleFile,
      });
      setError('请先上传视频和字幕文件');
      return;
    }

    console.log('Starting video processing...');
    setIsProcessing(true);
    setProgress(10);
    setError(null);

    try {
      // 创建FormData对象
      const formData = new FormData();
      formData.append('videoFile', videoFile);
      formData.append('subtitleFile', subtitleFile);

      // 模拟进度更新
      let currentProgress = 10;
      const progressInterval = setInterval(() => {
        if (currentProgress < 90) {
          currentProgress += Math.random() * 10;
          setProgress(currentProgress);
        }
      }, 1000);

      // 调用后端 API，设置更长的超时时间
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10 * 60 * 1000); // 10分钟超时

      const response = await fetch('/api/embed-subtitle', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '视频处理失败，请检查文件格式');
      }

      setProgress(90);

      // 获取处理后的视频文件
      const videoBlob = await response.blob();
      const processedUrl = URL.createObjectURL(videoBlob);
      setProcessedVideoUrl(processedUrl);
      setProgress(100);

      // 成功提示
      // alert('视频处理成功！字幕已添加到视频中，可以下载了。');
      toast.success('视频处理成功！字幕已添加到视频中，可以下载了。');
    } catch (error) {
      console.error('处理错误:', error);
      toast.error('视频处理失败，请重试');
      let errorMessage = '视频处理失败，请重试';

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = '请求超时，请尝试使用较小的视频文件或检查网络连接';
        } else if (error.message.includes('ECONNRESET')) {
          errorMessage =
            '连接被重置，可能是视频文件过大或处理时间过长。请尝试使用较小的视频文件';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = '网络连接失败，请检查网络连接后重试';
        } else {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);
      setProgress(0);

      // 直接弹窗提示用户
      alert(`视频处理失败：${errorMessage}`);
      // toast.error(`视频处理失败：${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedVideoUrl) {
      const link = document.createElement('a');
      link.href = processedVideoUrl;
      // 根据时间戳生成唯一文件名，避免覆盖
      const timestamp = new Date().getTime();
      link.download = `${timestamp}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const canProcess = videoFile && subtitleFile && !isProcessing;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 原视频预览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayIcon className="w-5 h-5" />
            原视频预览
          </CardTitle>
        </CardHeader>
        <CardContent>
          {videoUrl ? (
            <video
              controls
              className="w-full rounded-lg"
              src={videoUrl}
              style={{ maxHeight: '400px' }}
            />
          ) : (
            <div className="h-80 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <span className="text-gray-400">请先上传视频文件</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 处理后的视频 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayIcon className="w-5 h-5" />
            带字幕的视频
          </CardTitle>
        </CardHeader>
        <CardContent>
          {processedVideoUrl ? (
            <div className="space-y-4">
              <video
                controls
                className="w-full rounded-lg"
                src={processedVideoUrl}
                style={{ maxHeight: '400px' }}
              />
              <Button
                onClick={handleDownload}
                className="w-full cursor-pointer"
                size="lg"
                variant="ghost"
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                下载带字幕的视频
              </Button>
            </div>
          ) : (
            <div className="h-80 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <span className="text-gray-400">
                处理完成后将显示带字幕的视频
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 处理控制面板 */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>视频处理控制</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 错误提示 */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircleIcon className="w-5 h-5" />
                <span className="font-medium">处理失败</span>
              </div>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          )}

          {/* 进度条 */}
          {isProcessing && (
            <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between text-sm">
                <span className="text-blue-700 font-medium">
                  🎬 正在添加字幕...
                </span>
                <span className="text-blue-600 font-bold">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="w-full h-3" />
              <div className="text-xs text-blue-600 text-center">
                请耐心等待，视频处理需要一些时间...
              </div>
            </div>
          )}

          {/* 处理按钮 */}
          <Button
            variant="default"
            onClick={handleProcess}
            disabled={!canProcess}
            size="lg"
            className={`w-full transition-all duration-200 ${
              canProcess
                ? 'hover:scale-101 shadow-lg hover:shadow-xl cursor-pointer text-white'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <>
                <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                正在处理视频... {Math.round(progress)}%
              </>
            ) : (
              <>
                <PlayIcon className="w-4 h-4 mr-2" />
                {canProcess ? '🎬 点击生成带字幕的视频' : '生成带字幕的视频'}
              </>
            )}
          </Button>

          {/* 处理提示 */}
          {!videoFile && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700 text-center">
                📹 请先上传音乐MV视频文件
              </p>
            </div>
          )}
          {!subtitleFile && videoFile && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700 text-center">
                📝 请上传LRC字幕文件以开始处理
              </p>
            </div>
          )}
          {canProcess && !isProcessing && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 text-center font-medium">
                ✅ 文件准备就绪！点击上方按钮开始添加字幕
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
