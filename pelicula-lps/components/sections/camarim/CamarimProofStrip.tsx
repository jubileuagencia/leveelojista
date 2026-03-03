"use client";

import { useEffect, useRef } from "react";

const STATS = [
  { value: "52", label: "Lives por ano" },
  { value: "12+", label: "Membros ativos" },
  { value: "100%", label: "Conteúdo semanal" },
  { value: "∞", label: "Acesso ao arquivo" },
];

export default function CamarimProofStrip() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    const fadeEls = el.querySelectorAll(".fade-in");
    fadeEls.forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-12 md:py-16 section-alt border-y border-black/5">
      <div className="max-w-[1100px] mx-auto px-5">
        <div className="flex flex-wrap justify-center gap-8 md:gap-14">
          {STATS.map((stat) => (
            <div key={stat.label} className="fade-in text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-gold">
                {stat.value}
              </div>
              <div className="font-mono text-[0.65rem] tracking-[2px] uppercase text-text-muted mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
