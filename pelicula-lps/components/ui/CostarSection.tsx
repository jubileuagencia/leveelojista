"use client";

import { useEffect, useRef } from "react";

interface CostarSectionProps {
  children: React.ReactNode;
  id?: string;
  alt?: boolean;
  className?: string;
  narrow?: boolean;
}

export default function CostarSection({
  children,
  id,
  alt,
  className = "",
  narrow,
}: CostarSectionProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const fadeEls = el.querySelectorAll(".fade-in");
    fadeEls.forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className={`py-24 md:py-32 relative ${alt ? "border-t border-white/[0.06]" : ""} ${className}`}
    >
      <div
        className={`mx-auto px-6 md:px-8 ${narrow ? "max-w-[800px]" : "max-w-[1000px]"}`}
      >
        {children}
      </div>
    </section>
  );
}
