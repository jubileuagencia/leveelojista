import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { checkCourseAccess } from "@/lib/access";
import ModuleAccordion from "@/components/platform/ModuleAccordion";
import type { LessonData } from "@/components/platform/ModuleAccordion";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}): Promise<Metadata> {
  const { courseSlug } = await params;
  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("title")
    .eq("slug", courseSlug)
    .single();

  return {
    title: course ? `${course.title} — Película Sideral` : "Curso",
    robots: "noindex",
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", courseSlug)
    .eq("is_published", true)
    .single();

  if (!course) notFound();

  // Check access
  const hasAccess = user
    ? await checkCourseAccess(supabase, user.id, course.id)
    : false;

  // Fetch modules with lessons
  const { data: modules } = await supabase
    .from("modules")
    .select("*, lessons(*)")
    .eq("course_id", course.id)
    .order("sort_order", { ascending: true });

  // Fetch user progress for all lessons
  let progressMap: Record<string, { watched_percent: number; completed: boolean }> = {};
  if (user) {
    const { data: progressData } = await supabase
      .from("lesson_progress")
      .select("lesson_id, watched_percent, completed")
      .eq("user_id", user.id);

    if (progressData) {
      progressMap = Object.fromEntries(
        progressData.map((p) => [
          p.lesson_id,
          { watched_percent: p.watched_percent, completed: p.completed },
        ])
      );
    }
  }

  const totalLessons =
    modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;
  const completedLessons = Object.values(progressMap).filter(
    (p) => p.completed
  ).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Course hero */}
      <div className="mb-8">
        <Link
          href="/catalogo"
          className="text-sm text-text-muted hover:text-gold transition-colors mb-4 inline-block"
        >
          &larr; Catálogo
        </Link>

        {course.hero_image_url && (
          <div className="aspect-[21/9] rounded-xl overflow-hidden mb-6 bg-deep">
            <img
              src={course.hero_image_url}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-text mb-2">
          {course.title}
        </h1>
        {course.subtitle && (
          <p className="text-text-soft text-lg">{course.subtitle}</p>
        )}
        {course.description && (
          <p className="text-text-muted mt-3 leading-relaxed">
            {course.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-text-muted">
          <span>{course.instructor_name}</span>
          {totalLessons > 0 && <span>{totalLessons} aulas</span>}
          {course.total_duration_minutes > 0 && (
            <span>{course.total_duration_minutes}min</span>
          )}
          {completedLessons > 0 && (
            <span className="text-gold">
              {completedLessons}/{totalLessons} concluídas
            </span>
          )}
        </div>

        {!hasAccess && (
          <div className="mt-6 p-4 bg-card border border-gold/20 rounded-xl flex items-center justify-between gap-4">
            <div>
              <p className="text-text text-sm font-medium">
                Adquira acesso a este curso
              </p>
              <p className="text-text-muted text-xs mt-0.5">
                Aulas marcadas como grátis podem ser assistidas sem compra.
              </p>
            </div>
            <Link
              href="/checkout"
              className="shrink-0 bg-gold hover:bg-gold-light text-void font-semibold px-5 py-2 rounded-lg transition-colors text-sm"
            >
              Ver planos
            </Link>
          </div>
        )}
      </div>

      {/* Modules accordion */}
      <div className="space-y-3">
        {modules?.map((mod, i) => {
          const sortedLessons: LessonData[] = [...(mod.lessons || [])]
            .sort(
              (a: { sort_order: number }, b: { sort_order: number }) =>
                a.sort_order - b.sort_order
            )
            .map(
              (lesson: {
                id: string;
                slug: string;
                title: string;
                duration_minutes: number;
                is_free_preview: boolean;
              }) => ({
                ...lesson,
                progress: progressMap[lesson.id],
              })
            );

          return (
            <ModuleAccordion
              key={mod.id}
              title={mod.title}
              description={mod.description}
              lessons={sortedLessons}
              courseSlug={courseSlug}
              moduleIndex={i + 1}
              defaultOpen={i === 0}
              hasAccess={hasAccess}
            />
          );
        })}
      </div>
    </div>
  );
}
