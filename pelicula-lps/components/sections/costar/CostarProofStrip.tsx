"use client";

import { useEffect, useRef } from "react";

const STATS = [
  { value: "23", label: "Videoaulas" },
  { value: "6", label: "Módulos progressivos" },
  { value: "~2h", label: "De conteúdo" },
  { value: "5", label: "Camadas da mandala" },
  { value: "3", label: "Formas que decodificam tudo" },
];

export default function CostarProofStrip() {
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
    <section ref={ref} className="py-14 md:py-20 border-y border-white/[0.06]">
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-10 md:gap-16">
          {STATS.map((stat) => (
            <div key={stat.label} className="fade-in text-center">
              <div className="font-display text-4xl md:text-5xl font-bold text-white">
                {stat.value}
              </div>
              <div className="font-mono text-[0.55rem] tracking-[3px] uppercase text-white/30 mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
