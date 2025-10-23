'use client';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { useVideoStore } from '@/store/useVideoStore';

export function LrcSearch() {
  const [platform, setPlatform] = useState('netease');
  const [musicId, setMusicId] = useState('');
  const { subtitleUrl, setSubtitleUrl, setSubtitleFile } = useVideoStore();

  // 处理搜索逻辑
  async function handleSearch() {
    if (!musicId) {
      toast.error('请输入音乐id');
      return;
    }
    try {
      const response = await fetch(
        `https://metingapi-gray.vercel.app/api?server=${platform}&type=lrc&id=${musicId}`
      );
      console.log('搜索Lrc文件响应:', response);
      if (!response.ok || response.status !== 200) {
        toast.error('未找到LRC文件,请重试！');
        return;
      }
      const data = await response.text();
      if (data == '') {
        toast.error('未找到LRC文件,请重试！');
        return;
      }
      if (data.includes('暂无歌词')) {
        toast.error('未找到LRC文件,请重试！');
        return;
      }

      // 成功获取LRC内容
      setSubtitleUrl(data);
      setSubtitleFile(
        new File([data], `${musicId}.lrc`, { type: 'text/plain' })
      );
    } catch (error) {
      console.error('搜索Lrc文件失败:', error);
    }
  }

  return (
    <Card className="max-h-64 overflow-hidden flex  ">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          搜索LRC字幕文件
        </CardTitle>
      </CardHeader>
      <div className="flex flex-row justify-between">
        <CardContent className="max-w-2/3 flex flex-row flex-1">
          <div>
            <p className="mb-3">
              在这里你可以搜索并下载适用于你的音乐MV的LRC字幕文件。
            </p>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex md:flex-col gap-3">
                <div>
                  <ToggleGroup
                    type="single"
                    value={platform}
                    onValueChange={setPlatform} // 绑定状态更新
                    size="sm"
                  >
                    <ToggleGroupItem value="netease" aria-label="Toggle bold">
                      <p>网易云音乐</p>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="tencent" aria-label="Toggle italic">
                      <p>QQ音乐</p>
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="kugou"
                      aria-label="Toggle strikethrough"
                    >
                      <p>酷狗音乐</p>
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="输入音乐id获取LRC文件"
                    value={musicId}
                    onChange={(e) => setMusicId(e.target.value)}
                  />
                  <Button
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={handleSearch}
                  >
                    搜索
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div>
            {subtitleUrl ? (
              <div className="max-h-32 max-w-2xl overflow-auto">
                <p className="overflow-auto">{subtitleUrl}</p>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
