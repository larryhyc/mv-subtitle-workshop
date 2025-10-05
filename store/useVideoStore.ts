import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface VideoState {
  videoUrl: string | null;
  subtitleUrl: string | null;
  progress: number;
  setVideoUrl: (url: string) => void;
  setSubtitleUrl: (url: string) => void;
  setProgress: (progress: number) => void;
  reset: () => void;
}

export const useVideoStore = create<VideoState>()(
  devtools((set) => ({
    videoUrl: null,
    subtitleUrl: null,
    progress: 0,
    setVideoUrl: (url) => set({ videoUrl: url }),
    setSubtitleUrl: (url) => set({ subtitleUrl: url }),
    setProgress: (progress) => set({ progress }),
    reset: () => set({ videoUrl: null, subtitleUrl: null, progress: 0 }),
  }))
);
