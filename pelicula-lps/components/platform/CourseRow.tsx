"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import CourseCard, { type CourseCardData } from "./CourseCard";

export default function CourseRow({
  title,
  courses,
}: {
  title: string;
  courses: CourseCardData[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  if (courses.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text mb-4 px-1">
        {title}
      </h2>
      <div className="relative">
        <motion.div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </motion.div>

        {/* Fade edges */}
        <div className="absolute top-0 right-0 bottom-4 w-12 bg-gradient-to-l from-void to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
