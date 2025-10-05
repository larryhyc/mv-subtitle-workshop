import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useVideoStore } from '@/store/useVideoStore';

export const VideoEditor = () => {
  const { videoUrl, subtitleUrl, progress, setProgress } = useVideoStore();

  const handleProcess = async () => {
    setProgress(10); // 更新进度条
    try {
      // 调用后端 API
      const response = await fetch('/api/embed-subtitle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoFile: videoUrl, // 视频文件路径
          subtitleFile: subtitleUrl, // 字幕文件路径
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process video');
      }

      // 解析后端返回的数据
      const data = await response.json();
      setProgress(100); // 更新进度条
      alert(`视频处理完成！下载链接：${data.downloadUrl}`); // 显示下载链接
    } catch (error) {
      setProgress(0); // 重置进度条
      alert('视频处理失败，请重试！');
    }
  };

  return (
    <div className="flex flex-row justify-between space-x-3">
      {videoUrl ? (
        <video controls className="w-3/6 rounded-lg" src={videoUrl} />
      ) : (
        <div className="flex-1 h-80 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
          <span className="text-gray-400">视频预览</span>
        </div>
      )}
      <div className="w-3/6 flex flex-col space-y-2">
        <Progress value={progress} />
        <Button onClick={handleProcess} disabled={progress > 0}>
          生成带字幕的视频
        </Button>
      </div>
    </div>
  );
};
