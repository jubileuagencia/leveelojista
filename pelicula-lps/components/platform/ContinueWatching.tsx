"use client";

import Link from "next/link";
import ProgressBar from "./ProgressBar";

export type ContinueWatchingItem = {
  courseSlug: string;
  lessonSlug: string;
  courseTitle: string;
  lessonTitle: string;
  thumbnail_url?: string | null;
  watchedPercent: number;
  durationMinutes: number;
};

export default function ContinueWatching({
  items,
}: {
  items: ContinueWatchingItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text mb-4 px-1">
        Continuar assistindo
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link
            key={`${item.courseSlug}-${item.lessonSlug}`}
            href={`/curso/${item.courseSlug}/${item.lessonSlug}`}
            className="group bg-card border border-white/5 rounded-xl overflow-hidden hover:border-gold/20 transition-all"
          >
            <div className="relative aspect-video bg-deep">
              {item.thumbnail_url ? (
                <img
                  src={item.thumbnail_url}
                  alt={item.lessonTitle}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple/20 to-gold/5">
                  <svg
                    className="w-10 h-10 text-gold/30 group-hover:text-gold/60 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
              <ProgressBar
                percent={item.watchedPercent}
                className="absolute bottom-0 left-0 right-0 rounded-none"
              />
            </div>
            <div className="p-3">
              <p className="text-text text-sm font-medium truncate group-hover:text-gold transition-colors">
                {item.lessonTitle}
              </p>
              <p className="text-text-muted text-xs mt-0.5 truncate">
                {item.courseTitle}
                {item.durationMinutes > 0 && ` · ${item.durationMinutes}min`}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
