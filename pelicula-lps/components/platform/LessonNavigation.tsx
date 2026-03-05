"use client";

import Link from "next/link";

type NavLesson = {
  slug: string;
  title: string;
} | null;

export default function LessonNavigation({
  courseSlug,
  prev,
  next,
}: {
  courseSlug: string;
  prev: NavLesson;
  next: NavLesson;
}) {
  return (
    <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-white/5">
      {prev ? (
        <Link
          href={`/curso/${courseSlug}/${prev.slug}`}
          className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors group min-w-0"
        >
          <svg
            className="w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          <span className="truncate">{prev.title}</span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/curso/${courseSlug}/${next.slug}`}
          className="flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors group min-w-0"
        >
          <span className="truncate">{next.title}</span>
          <svg
            className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
