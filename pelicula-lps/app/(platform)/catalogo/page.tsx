import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import CourseCard from "@/components/platform/CourseCard";
import CourseRow from "@/components/platform/CourseRow";
import ContinueWatching from "@/components/platform/ContinueWatching";
import type { CourseCardData } from "@/components/platform/CourseCard";
import type { ContinueWatchingItem } from "@/components/platform/ContinueWatching";

export const metadata: Metadata = {
  title: "Catálogo — Película Sideral",
  robots: "noindex",
};

export default async function CatalogoPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch published courses
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: true });

  // Fetch in-progress lessons for "Continue Watching"
  let continueItems: ContinueWatchingItem[] = [];
  if (user) {
    const { data: progress } = await supabase
      .from("lesson_progress")
      .select(
        `
        watched_percent,
        last_position_seconds,
        lessons!inner (
          slug,
          title,
          duration_minutes,
          modules!inner (
            courses!inner (
              slug,
              title,
              thumbnail_url
            )
          )
        )
      `
      )
      .eq("user_id", user.id)
      .eq("completed", false)
      .gt("watched_percent", 0)
      .order("updated_at", { ascending: false })
      .limit(6);

    if (progress) {
      continueItems = progress.map((p: Record<string, unknown>) => {
        const lesson = p.lessons as Record<string, unknown>;
        const module = lesson.modules as Record<string, unknown>;
        const course = module.courses as Record<string, unknown>;
        return {
          courseSlug: course.slug as string,
          lessonSlug: lesson.slug as string,
          courseTitle: course.title as string,
          lessonTitle: lesson.title as string,
          thumbnail_url: course.thumbnail_url as string | null,
          watchedPercent: p.watched_percent as number,
          durationMinutes: lesson.duration_minutes as number,
        };
      });
    }
  }

  const courseCards: CourseCardData[] = (courses || []).map((c) => ({
    slug: c.slug,
    title: c.title,
    subtitle: c.subtitle,
    thumbnail_url: c.thumbnail_url,
    instructor_name: c.instructor_name,
    total_lessons: c.total_lessons,
  }));

  const heroCourse = courseCards[0];
  const restCourses = courseCards.slice(1);

  return (
    <div className="max-w-6xl mx-auto space-y-2">
      {/* Hero banner */}
      {heroCourse && (
        <section className="mb-8">
          <CourseCard course={heroCourse} variant="hero" />
        </section>
      )}

      {/* Continue Watching */}
      <ContinueWatching items={continueItems} />

      {/* Course rows */}
      {restCourses.length > 0 && (
        <CourseRow title="Todos os cursos" courses={restCourses} />
      )}

      {/* If only one course, show it in a different layout too */}
      {courseCards.length === 1 && (
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text mb-4 px-1">
            Seus cursos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CourseCard course={heroCourse} variant="wide" />
          </div>
        </section>
      )}

      {(!courses || courses.length === 0) && (
        <div className="text-center py-16 text-text-muted">
          <p className="text-lg">Nenhum curso disponível ainda.</p>
          <p className="text-sm mt-2">
            Em breve novos conteúdos serão publicados.
          </p>
        </div>
      )}
    </div>
  );
}
