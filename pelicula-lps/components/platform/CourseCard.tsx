"use client";

import Link from "next/link";
import ProgressBar from "./ProgressBar";

export type CourseCardData = {
  slug: string;
  title: string;
  subtitle?: string | null;
  thumbnail_url?: string | null;
  instructor_name: string;
  total_lessons: number;
  completed_lessons?: number;
};

export default function CourseCard({
  course,
  variant = "default",
}: {
  course: CourseCardData;
  variant?: "default" | "hero" | "wide";
}) {
  const progress =
    course.total_lessons > 0 && course.completed_lessons
      ? Math.round((course.completed_lessons / course.total_lessons) * 100)
      : 0;

  if (variant === "hero") {
    return (
      <Link
        href={`/curso/${course.slug}`}
        className="group relative block w-full aspect-[21/9] rounded-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-transparent z-10" />
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple/30 to-gold/10" />
        )}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-text mb-2">
            {course.title}
          </h2>
          {course.subtitle && (
            <p className="text-text-soft text-lg mb-4 max-w-2xl">
              {course.subtitle}
            </p>
          )}
          <div className="flex items-center gap-4">
            <span className="bg-gold text-void px-5 py-2 rounded-lg font-semibold text-sm group-hover:bg-gold-light transition-colors">
              {progress > 0 ? "Continuar" : "Assistir"}
            </span>
            <span className="text-text-muted text-sm">
              {course.instructor_name}
            </span>
          </div>
          {progress > 0 && (
            <ProgressBar percent={progress} className="mt-4 max-w-xs" />
          )}
        </div>
      </Link>
    );
  }

  if (variant === "wide") {
    return (
      <Link
        href={`/curso/${course.slug}`}
        className="group flex bg-card border border-white/5 rounded-xl overflow-hidden hover:border-gold/20 transition-all"
      >
        <div className="w-48 md:w-64 shrink-0 bg-deep">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple/20 to-gold/5">
              <span className="text-3xl opacity-20">🎬</span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col justify-center min-w-0">
          <h3 className="font-[family-name:var(--font-display)] font-semibold text-text group-hover:text-gold transition-colors truncate">
            {course.title}
          </h3>
          {course.subtitle && (
            <p className="text-text-muted text-sm mt-1 truncate">
              {course.subtitle}
            </p>
          )}
          {progress > 0 && (
            <div className="mt-3">
              <ProgressBar percent={progress} />
              <p className="text-xs text-text-muted mt-1">{progress}%</p>
            </div>
          )}
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link
      href={`/curso/${course.slug}`}
      className="group block w-64 md:w-72 shrink-0 snap-start"
    >
      <div className="aspect-video rounded-xl overflow-hidden bg-deep mb-3">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple/20 to-gold/5">
            <span className="text-4xl opacity-20">🎬</span>
          </div>
        )}
      </div>
      <h3 className="font-[family-name:var(--font-display)] font-semibold text-text text-sm group-hover:text-gold transition-colors truncate">
        {course.title}
      </h3>
      <p className="text-text-muted text-xs mt-1">
        {course.instructor_name}
        {course.total_lessons > 0 && ` · ${course.total_lessons} aulas`}
      </p>
      {progress > 0 && <ProgressBar percent={progress} className="mt-2" />}
    </Link>
  );
}
