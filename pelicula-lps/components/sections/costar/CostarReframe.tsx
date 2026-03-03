import Image from "next/image";
import CostarSection from "@/components/ui/CostarSection";

export default function CostarReframe() {
  return (
    <CostarSection narrow>
      <div className="fade-in relative py-10 md:py-16">
        <div className="grid md:grid-cols-[160px_1fr] gap-8 items-center">
          {/* Victor photo */}
          <div className="fade-in hidden md:block">
            <div className="relative w-40 h-56 border border-white/10 overflow-hidden">
              <Image
                src="/assets/victor-lado.jpeg"
                alt="Victor"
                fill
                className="object-cover grayscale"
                sizes="160px"
              />
            </div>
          </div>

          <div className="text-center md:text-left relative z-10">
            <div className="w-8 h-px bg-white/20 md:mx-0 mx-auto mb-10" />
            <blockquote className="font-display text-2xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-[-0.01em]">
              <span className="text-white">&ldquo;O mapa astral não é o céu.</span>
              <br />
              <span className="text-white/60">
                É um diagrama. E diagramas
              </span>
              <br />
              <span className="text-white/60">se aprendem a ler.&rdquo;</span>
            </blockquote>
            <p className="font-mono text-[0.6rem] tracking-[4px] uppercase text-white/25 mt-8">
              — Premissa central do curso
            </p>
            <div className="w-8 h-px bg-white/20 md:mx-0 mx-auto mt-10" />
          </div>
        </div>
      </div>
    </CostarSection>
  );
}
