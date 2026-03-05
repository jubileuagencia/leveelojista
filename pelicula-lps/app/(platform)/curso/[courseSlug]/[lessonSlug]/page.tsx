import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { checkCourseAccess } from "@/lib/access";
import LessonPlayer from "@/components/platform/LessonPlayer";
import LessonNavigation from "@/components/platform/LessonNavigation";
import AccessGate from "@/components/platform/AccessGate";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}): Promise<Metadata> {
  const { courseSlug, lessonSlug } = await params;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("id, title")
    .eq("slug", courseSlug)
    .single();

  if (!course) return { title: "Aula" };

  const { data: lesson } = await supabase
    .from("lessons")
    .select("title, module_id, modules!inner(course_id)")
    .eq("slug", lessonSlug)
    .eq("modules.course_id", course.id)
    .single();

  return {
    title: lesson
      ? `${lesson.title} — ${course.title}`
      : "Aula — Película Sideral",
    robots: "noindex",
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get course
  const { data: course } = await supabase
    .from("courses")
    .select("id, slug, title")
    .eq("slug", courseSlug)
    .eq("is_published", true)
    .single();

  if (!course) notFound();

  // Get lesson with module info
  const { data: lesson } = await supabase
    .from("lessons")
    .select("*, modules!inner(id, title, course_id, sort_order)")
    .eq("slug", lessonSlug)
    .eq("modules.course_id", course.id)
    .single();

  if (!lesson) notFound();

  // Check access
  const hasAccess = user
    ? await checkCourseAccess(supabase, user.id, course.id)
    : false;
  const canWatch = hasAccess || lesson.is_free_preview;

  // Get all lessons in this course for navigation
  const { data: allLessons } = await supabase
    .from("lessons")
    .select("id, slug, title, sort_order, module_id, modules!inner(course_id, sort_order)")
    .eq("modules.course_id", course.id)
    .order("sort_order", { ascending: true });

  // Sort lessons by module order then lesson order
  const sortedLessons = (allLessons || []).sort((a, b) => {
    const aModOrder = (a.modules as unknown as { sort_order: number }).sort_order;
    const bModOrder = (b.modules as unknown as { sort_order: number }).sort_order;
    if (aModOrder !== bModOrder) return aModOrder - bModOrder;
    return a.sort_order - b.sort_order;
  });

  const currentIndex = sortedLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < sortedLessons.length - 1
      ? sortedLessons[currentIndex + 1]
      : null;

  // Get lesson progress for resume
  let startAt = 0;
  if (user) {
    const { data: progress } = await supabase
      .from("lesson_progress")
      .select("last_position_seconds, completed")
      .eq("user_id", user.id)
      .eq("lesson_id", lesson.id)
      .single();

    if (progress && !progress.completed) {
      startAt = progress.last_position_seconds;
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-4">
        <Link
          href={`/curso/${courseSlug}`}
          className="text-sm text-text-muted hover:text-gold transition-colors"
        >
          &larr; {course.title}
        </Link>
      </div>

      {/* Video player or access gate */}
      {!canWatch ? (
        <div className="mb-6">
          <AccessGate courseTitle={course.title} />
        </div>
      ) : lesson.panda_video_id ? (
        <div className="mb-6">
          <LessonPlayer
            videoId={lesson.panda_video_id}
            lessonId={lesson.id}
            startAt={startAt}
          />
        </div>
      ) : (
        <div className="aspect-video bg-deep border border-white/5 rounded-xl flex items-center justify-center mb-6">
          <div className="text-center text-text-muted">
            <svg
              className="w-16 h-16 mx-auto mb-3 opacity-30"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            <p className="text-sm">Vídeo em preparação</p>
          </div>
        </div>
      )}

      {/* Lesson info */}
      <div className="space-y-2">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text">
          {lesson.title}
        </h1>
        {lesson.description && (
          <p className="text-text-muted">{lesson.description}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-text-muted">
          <span>{(lesson.modules as unknown as { title: string }).title}</span>
          {lesson.duration_minutes > 0 && (
            <span>{lesson.duration_minutes}min</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <LessonNavigation
        courseSlug={courseSlug}
        prev={prevLesson ? { slug: prevLesson.slug, title: prevLesson.title } : null}
        next={nextLesson ? { slug: nextLesson.slug, title: nextLesson.title } : null}
      />
    </div>
  );
}
