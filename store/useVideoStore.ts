import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface VideoState {
  videoUrl: string | null;
  videoFile: File | null;
  subtitleUrl: string | null;
  subtitleFile: File | null;
  progress: number;
  isProcessing: boolean;
  processedVideoUrl: string | null;
  error: string | null;
  setVideoUrl: (url: string) => void;
  setVideoFile: (file: File | null) => void;
  setSubtitleUrl: (url: string) => void;
  setSubtitleFile: (file: File | null) => void;
  setProgress: (progress: number) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setProcessedVideoUrl: (url: string | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useVideoStore = create<VideoState>()(
  devtools((set) => ({
    videoUrl: null,
    videoFile: null,
    subtitleUrl: null,
    subtitleFile: null,
    progress: 0,
    isProcessing: false,
    processedVideoUrl: null,
    error: null,
    setVideoUrl: (url) => set({ videoUrl: url, error: null }),
    setVideoFile: (file) => set({ videoFile: file, error: null }),
    setSubtitleUrl: (url) => set({ subtitleUrl: url, error: null }),
    setSubtitleFile: (file) => set({ subtitleFile: file, error: null }),
    setProgress: (progress) => set({ progress }),
    setIsProcessing: (isProcessing) => set({ isProcessing, error: null }),
    setProcessedVideoUrl: (url) => set({ processedVideoUrl: url }),
    setError: (error) => set({ error, isProcessing: false, progress: 0 }),
    reset: () =>
      set({
        videoUrl: null,
        videoFile: null,
        subtitleUrl: null,
        subtitleFile: null,
        progress: 0,
        isProcessing: false,
        processedVideoUrl: null,
        error: null,
      }),
  }))
);
