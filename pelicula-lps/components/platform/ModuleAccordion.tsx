"use client";

import { useState } from "react";
import LessonRow from "./LessonRow";

export type LessonData = {
  id: string;
  slug: string;
  title: string;
  duration_minutes: number;
  is_free_preview: boolean;
  progress?: {
    watched_percent: number;
    completed: boolean;
  };
};

export default function ModuleAccordion({
  title,
  description,
  lessons,
  courseSlug,
  moduleIndex,
  defaultOpen = false,
  hasAccess = false,
}: {
  title: string;
  description?: string | null;
  lessons: LessonData[];
  courseSlug: string;
  moduleIndex: number;
  defaultOpen?: boolean;
  hasAccess?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const completedCount = lessons.filter((l) => l.progress?.completed).length;
  const totalMinutes = lessons.reduce((s, l) => s + l.duration_minutes, 0);

  return (
    <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted font-mono">
              {String(moduleIndex).padStart(2, "0")}
            </span>
            <h3 className="font-[family-name:var(--font-display)] font-semibold text-text truncate">
              {title}
            </h3>
          </div>
          {description && !open && (
            <p className="text-text-muted text-sm mt-1 ml-9 truncate">
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4 shrink-0 ml-4">
          <span className="text-xs text-text-muted hidden sm:inline">
            {completedCount}/{lessons.length} aulas
            {totalMinutes > 0 && ` · ${totalMinutes}min`}
          </span>
          <svg
            className={`w-5 h-5 text-text-muted transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {description && (
          <p className="text-text-muted text-sm px-5 pb-3 ml-9">
            {description}
          </p>
        )}
        <div className="border-t border-white/5 divide-y divide-white/5">
          {lessons.map((lesson, i) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              courseSlug={courseSlug}
              index={i + 1}
              locked={!hasAccess && !lesson.is_free_preview}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
