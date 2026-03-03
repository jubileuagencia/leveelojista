"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import CostarButton from "@/components/ui/CostarButton";
import { CHECKOUT_URLS } from "@/lib/constants";

export default function CostarHero() {
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
      className="relative min-h-screen flex items-center justify-center py-28 md:py-36 overflow-hidden"
    >
      {/* Victor background image - subtle */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/victor-curvado.jpeg"
          alt=""
          fill
          className="object-cover grayscale opacity-[0.07]"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
      </div>

      {/* Subtle grain texture */}
      <div className="absolute inset-0 opacity-[0.03] z-[1]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      {/* Thin cross lines */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2]">
        <div className="w-px h-[60vh] bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute w-[60vw] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <div className="relative z-10 max-w-[900px] mx-auto px-6">
        <div className="grid md:grid-cols-[1fr_240px] gap-10 items-center">
          <div className="text-center md:text-left">
            <div className="fade-in">
              <span className="font-mono text-[0.6rem] font-bold tracking-[6px] uppercase text-white/40 mb-8 block">
                Película Sideral apresenta
              </span>
            </div>

            <h1 className="fade-in font-display text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.02] mb-8 tracking-[-0.02em]">
              Decifrando o
              <br />
              Mapa Astral
            </h1>

            <div className="fade-in w-12 h-px bg-white/20 md:mx-0 mx-auto mb-8" />

            <p className="fade-in text-white/60 text-lg md:text-xl leading-relaxed max-w-[580px] mb-5">
              O mapa astral não é mistério. É um diagrama.
              <br className="hidden md:block" /> E se você consegue ler um mapa de
              metrô, consegue ler um mapa astral.
            </p>

            <p className="fade-in text-white/40 text-base md:text-lg leading-relaxed max-w-[560px] mb-10">
              Em 23 aulas, você vai olhar pra qualquer mapa astral e entender o que
              está vendo — sem decorar, sem misticismo, sem depender de ninguém.
            </p>

            <div className="fade-in font-mono text-[0.6rem] tracking-[4px] uppercase text-white/30 mb-12">
              23 videoaulas · ~2h de conteúdo · Acesso imediato
            </div>

            <div className="fade-in mb-8">
              <CostarButton href={CHECKOUT_URLS.curso}>Quero aprender a ler o céu</CostarButton>
            </div>

            <p className="fade-in font-mono text-[0.55rem] tracking-[3px] uppercase text-white/25">
              Preço de lançamento · Garantia incondicional de 7 dias
            </p>
          </div>

          {/* Victor portrait */}
          <div className="fade-in hidden md:block">
            <div className="relative w-full h-[340px] border border-white/10 overflow-hidden">
              <Image
                src="/assets/victor-frente.jpeg"
                alt="Victor — Película Sideral"
                fill
                className="object-cover grayscale"
                sizes="240px"
                priority
              />
            </div>
            <p className="font-mono text-[0.5rem] tracking-[3px] uppercase text-white/20 mt-3 text-center">
              Victor · Película Sideral
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
