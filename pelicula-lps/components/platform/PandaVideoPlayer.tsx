"use client";

import { useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    PandaPlayer: new (
      id: string,
      options: {
        onReady?: () => void;
        onError?: (e: unknown) => void;
      }
    ) => PandaPlayerInstance;
  }
}

interface PandaPlayerInstance {
  getCurrentTime: () => number;
  getDuration: () => number;
  seek: (time: number) => void;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  destroy: () => void;
}

export default function PandaVideoPlayer({
  videoId,
  watermarkToken,
  startAt = 0,
  onProgress,
  onComplete,
}: {
  videoId: string;
  watermarkToken?: string;
  startAt?: number;
  onProgress?: (data: {
    currentTime: number;
    duration: number;
    percent: number;
  }) => void;
  onComplete?: () => void;
}) {
  const playerRef = useRef<PandaPlayerInstance | null>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastReportedTime = useRef(0);

  const reportProgress = useCallback(() => {
    if (!playerRef.current || !onProgress) return;
    const currentTime = playerRef.current.getCurrentTime();
    const duration = playerRef.current.getDuration();
    if (!duration || duration <= 0) return;

    // Only report if position changed by at least 5s
    if (Math.abs(currentTime - lastReportedTime.current) < 5) return;
    lastReportedTime.current = currentTime;

    const percent = Math.round((currentTime / duration) * 100);
    onProgress({ currentTime: Math.floor(currentTime), duration: Math.floor(duration), percent });
  }, [onProgress]);

  useEffect(() => {
    // Load Panda SDK
    const existingScript = document.getElementById("panda-sdk");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "panda-sdk";
      script.src = "https://player.pandavideo.com.br/api.v2.js";
      script.async = true;
      document.head.appendChild(script);
    }

    function initPlayer() {
      if (!window.PandaPlayer) {
        setTimeout(initPlayer, 200);
        return;
      }

      const player = new window.PandaPlayer(`panda-${videoId}`, {
        onReady() {
          playerRef.current = player;

          // Resume from last position
          if (startAt > 0) {
            player.seek(startAt);
          }

          // Progress tracking every 10 seconds
          progressInterval.current = setInterval(reportProgress, 10000);

          // Completion event (>=90%)
          player.on("panda_ended", () => {
            reportProgress();
            onComplete?.();
          });
        },
        onError(e) {
          console.error("Panda Video error:", e);
        },
      });
    }

    initPlayer();

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      // Final progress report on unmount
      reportProgress();
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // Player may already be destroyed
        }
      }
    };
  }, [videoId, startAt, reportProgress, onComplete]);

  const iframeSrc = watermarkToken
    ? `https://player-vz-7b3e4e65-d65.tv.pandavideo.com.br/embed/?v=${videoId}&watermark=${watermarkToken}`
    : `https://player-vz-7b3e4e65-d65.tv.pandavideo.com.br/embed/?v=${videoId}`;

  return (
    <div className="relative aspect-video bg-void rounded-xl overflow-hidden">
      <iframe
        id={`panda-${videoId}`}
        src={iframeSrc}
        className="absolute inset-0 w-full h-full border-0"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
