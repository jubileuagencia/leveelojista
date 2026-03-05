"use client";

import { useState, useEffect, useCallback } from "react";
import PandaVideoPlayer from "./PandaVideoPlayer";

export default function LessonPlayer({
  videoId,
  lessonId,
  startAt = 0,
}: {
  videoId: string;
  lessonId: string;
  startAt?: number;
}) {
  const [watermarkToken, setWatermarkToken] = useState<string | undefined>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function fetchToken() {
      try {
        const res = await fetch("/api/panda/watermark-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoId }),
        });
        if (res.ok) {
          const { token } = await res.json();
          setWatermarkToken(token);
        }
      } catch {
        // Proceed without watermark if token fetch fails
      }
      setReady(true);
    }
    fetchToken();
  }, [videoId]);

  const handleProgress = useCallback(
    async (data: { currentTime: number; duration: number; percent: number }) => {
      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId,
            watchedSeconds: data.currentTime,
            watchedPercent: data.percent,
            lastPositionSeconds: data.currentTime,
          }),
        });
      } catch {
        // Silent fail for progress — non-critical
      }
    },
    [lessonId]
  );

  const handleComplete = useCallback(async () => {
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          watchedPercent: 100,
          completed: true,
        }),
      });
    } catch {
      // Silent fail
    }
  }, [lessonId]);

  if (!ready) {
    return (
      <div className="aspect-video bg-deep rounded-xl flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PandaVideoPlayer
      videoId={videoId}
      watermarkToken={watermarkToken}
      startAt={startAt}
      onProgress={handleProgress}
      onComplete={handleComplete}
    />
  );
}
