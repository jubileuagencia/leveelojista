"use client";

import Link from "next/link";
import type { LessonData } from "./ModuleAccordion";

export default function LessonRow({
  lesson,
  courseSlug,
  index,
  locked = false,
}: {
  lesson: LessonData;
  courseSlug: string;
  index: number;
  locked?: boolean;
}) {
  const completed = lesson.progress?.completed;
  const percent = lesson.progress?.watched_percent || 0;

  const content = (
    <div className="flex items-center justify-between p-4 hover:bg-white/[0.03] transition-colors group">
      <div className="flex items-center gap-3 min-w-0">
        {/* Status icon */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
          {locked ? (
            <svg
              className="w-4 h-4 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          ) : completed ? (
            <svg
              className="w-5 h-5 text-aspect-green"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-text-muted group-hover:text-gold transition-colors"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted font-mono">
              {String(index).padStart(2, "0")}
            </span>
            <span
              className={`text-sm truncate ${
                locked
                  ? "text-text-muted"
                  : "text-text-soft group-hover:text-text transition-colors"
              }`}
            >
              {lesson.title}
            </span>
          </div>
          {/* Progress bar inline */}
          {!locked && percent > 0 && !completed && (
            <div className="ml-7 mt-1.5 h-0.5 w-24 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold rounded-full"
                style={{ width: `${percent}%` }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-4">
        {lesson.is_free_preview && !locked && (
          <span className="text-[10px] bg-gold/10 text-gold px-1.5 py-0.5 rounded font-medium">
            GRÁTIS
          </span>
        )}
        {lesson.duration_minutes > 0 && (
          <span className="text-xs text-text-muted">
            {lesson.duration_minutes}min
          </span>
        )}
      </div>
    </div>
  );

  if (locked) {
    return <div className="opacity-60 cursor-not-allowed">{content}</div>;
  }

  return (
    <Link href={`/curso/${courseSlug}/${lesson.slug}`}>{content}</Link>
  );
}
