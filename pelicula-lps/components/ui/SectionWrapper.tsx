"use client";

import { useEffect, useRef } from "react";

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  alt?: boolean;
  className?: string;
  narrow?: boolean;
}

export default function SectionWrapper({
  children,
  id,
  alt,
  className = "",
  narrow,
}: SectionWrapperProps) {
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
      className={`py-20 md:py-28 relative ${alt ? "section-alt" : ""} ${className}`}
    >
      <div
        className={`mx-auto px-5 md:px-6 ${narrow ? "max-w-[900px]" : "max-w-[1100px]"}`}
      >
        {children}
      </div>
    </section>
  );
}
