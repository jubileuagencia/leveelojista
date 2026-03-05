"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import CostarSection from "@/components/ui/CostarSection";
import CostarButton from "@/components/ui/CostarButton";
import { CHECKOUT_URLS } from "@/lib/constants";

const LAYERS = [
  {
    num: 1,
    name: "O Palco",
    text: "Antes de ler qualquer símbolo, entenda o espaço. O mapa tem três anéis concêntricos, uma bússola invertida (o Leste fica à esquerda), e quatro pontos cardeais que ancoram tudo: Ascendente, Descendente, Meio do Céu e Fundo do Céu.",
    highlight:
      "Os planetas são os atores. Os signos são os figurinos. As casas são os cenários. Os aspectos são os diálogos.",
  },
  {
    num: 2,
    name: "Os Atores",
    text: "Círculo, crescente e cruz. Três formas primitivas que, combinadas, geram TODOS os glifos planetários. Aprenda três formas e você decodifica Sol, Lua, Mercúrio, Vênus, Marte, Júpiter, Saturno e os transpessoais.",
    highlight: "Três formas. Três princípios. Infinitas combinações.",
  },
  {
    num: 3,
    name: "Os Cenários",
    text: "As 12 fatias da roda. Cada uma é uma sala na casa da sua vida — carreira, relacionamentos, criatividade, mundo interior. As casas são ONDE os atores atuam.",
    highlight:
      "As casas são o cenário onde os planetas atuam. São as salas da casa da sua vida.",
  },
  {
    num: 4,
    name: "Os Diálogos",
    text: "As linhas coloridas no centro do mapa não são decoração. Vermelho = tensão. Azul = harmonia. Verde = ajuste. São conversas entre planetas — entre partes da sua psique.",
    highlight:
      "Quando você olha pro centro do mapa, não está vendo linhas. Está vendo a conversa entre as partes da sua psique.",
  },
  {
    num: 5,
    name: "As Legendas",
    text: "Graus, retrógrados, elementos, modalidades. O rodapé técnico que transforma uma leitura boa em uma leitura precisa. Como os créditos finais de um filme — quem não lê perde metade da história.",
    highlight: null,
  },
];

const GLYPHS = ["☉", "☽", "☿", "♀", "♂", "♃", "♄", "♅", "♆", "♇", "☊", "⚸"];

function AnimatedChart() {
  const chartRef = useRef(null);
  const isInView = useInView(chartRef, { once: true, amount: 0.3 });

  return (
    <div ref={chartRef} className="relative w-full max-w-[380px] mx-auto aspect-square">
      <svg viewBox="0 0 400 400" className="w-full h-full">
        {/* Outer rings */}
        <motion.circle
          cx="200" cy="200" r="185"
          fill="none" stroke="white" strokeWidth="0.8" opacity="0.3"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.circle
          cx="200" cy="200" r="165"
          fill="none" stroke="white" strokeWidth="0.5" opacity="0.2"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
        />

        {/* House divisions - 12 lines */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 200 + Math.cos(rad) * 145;
          const y1 = 200 + Math.sin(rad) * 145;
          const x2 = 200 + Math.cos(rad) * 185;
          const y2 = 200 + Math.sin(rad) * 185;
          return (
            <motion.line
              key={angle} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="white" strokeWidth="0.5" opacity="0.2"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.08 }}
            />
          );
        })}

        {/* Inner house ring */}
        <motion.circle
          cx="200" cy="200" r="145"
          fill="none" stroke="white" strokeWidth="0.4" opacity="0.15"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.5 }}
        />

        {/* Planet glyphs */}
        {GLYPHS.map((glyph, i) => {
          const angle = (i * 30 + 15) * Math.PI / 180;
          const r = 115;
          const x = 200 + Math.cos(angle) * r;
          const y = 200 + Math.sin(angle) * r;
          return (
            <motion.text
              key={i} x={x} y={y + 4}
              fill="white" fontSize="14" textAnchor="middle"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.35 } : {}}
              transition={{ duration: 0.6, delay: 1.5 + i * 0.1 }}
            >
              {glyph}
            </motion.text>
          );
        })}

        {/* Aspect lines */}
        {[
          { x1: 140, y1: 120, x2: 280, y2: 260 },
          { x1: 120, y1: 240, x2: 300, y2: 180 },
          { x1: 200, y1: 100, x2: 160, y2: 290 },
          { x1: 260, y1: 120, x2: 140, y2: 280 },
          { x1: 150, y1: 160, x2: 270, y2: 230 },
        ].map((line, i) => (
          <motion.line
            key={`aspect-${i}`}
            x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
            stroke="white" strokeWidth="0.5" opacity="0.12"
            strokeDasharray={i === 2 ? "4 4" : "none"}
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1, delay: 2 + i * 0.15 }}
          />
        ))}

        {/* Planet dots */}
        {[
          { x: 140, y: 120 }, { x: 280, y: 260 }, { x: 120, y: 240 },
          { x: 300, y: 180 }, { x: 200, y: 100 }, { x: 260, y: 120 },
          { x: 160, y: 290 }, { x: 130, y: 150 },
        ].map((p, i) => (
          <motion.circle
            key={`dot-${i}`}
            cx={p.x} cy={p.y} r="3"
            fill="white" opacity="0.35"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.3, delay: 2.5 + i * 0.08 }}
          />
        ))}

        {/* Cardinal labels */}
        {[
          { x: 28, y: 204, label: "AC" },
          { x: 358, y: 204, label: "DC" },
          { x: 190, y: 28, label: "MC" },
          { x: 190, y: 390, label: "IC" },
        ].map((lbl) => (
          <motion.text
            key={lbl.label} x={lbl.x} y={lbl.y}
            fill="white" fontSize="9" fontFamily="monospace"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.3 } : {}}
            transition={{ duration: 0.5, delay: 3 }}
          >
            {lbl.label}
          </motion.text>
        ))}

        {/* Slow rotation overlay */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "200px 200px" }}
        >
          <circle cx="200" cy="200" r="195" fill="none" stroke="white" strokeWidth="0.2" opacity="0.08" strokeDasharray="2 8" />
        </motion.g>
      </svg>
    </div>
  );
}

export default function CostarFiveLayers() {
  return (
    <CostarSection id="metodo">
      <div className="text-center mb-16">
        <span className="fade-in font-mono text-[0.6rem] font-bold tracking-[5px] uppercase text-white/30 mb-5 block">
          O método
        </span>
        <h2 className="fade-in font-display text-3xl md:text-5xl font-bold mb-5">
          5 camadas. Uma mandala.
          <br />
          Uma linguagem.
        </h2>
        <p className="fade-in text-white/50 text-lg max-w-[640px] mx-auto">
          O mapa astral é um diagrama em camadas — como um filme tem cenário,
          atores, figurinos, diálogos e legendas. Você aprende a ler uma camada
          de cada vez. Quando chega na última, a história inteira faz sentido.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          {LAYERS.map((layer) => (
            <div key={layer.num} className="fade-in flex gap-5 group">
              <div className="flex-shrink-0 w-10 h-10 border border-white/20 flex items-center justify-center font-mono text-sm text-white/60 font-bold group-hover:border-white/40 transition-colors">
                {layer.num}
              </div>
              <div>
                <h3 className="font-display text-lg md:text-xl font-semibold mb-2 text-white/90">
                  {layer.name}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed mb-2">
                  {layer.text}
                </p>
                {layer.highlight && (
                  <p className="text-[0.7rem] font-mono text-white/25 italic">
                    &ldquo;{layer.highlight}&rdquo;
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="fade-in hidden lg:block sticky top-24">
          <AnimatedChart />
        </div>
      </div>

      {/* Victor teaching photo + CTA */}
      <div className="fade-in mt-20 grid md:grid-cols-[1fr_280px] gap-10 items-center max-w-[900px] mx-auto">
        <div>
          <p className="text-white/50 text-base leading-relaxed mb-6">
            No curso, Victor desenha cada camada na sua frente. Você vê o mapa
            sendo construído do zero — e entende por que cada elemento existe
            onde existe.
          </p>
          <CostarButton href={CHECKOUT_URLS.curso}>
            Quero aprender o método
          </CostarButton>
        </div>
        <div className="relative w-full h-64 border border-white/10 overflow-hidden">
          <Image
            src="/assets/victor-aula.png"
            alt="Victor ministrando aula sobre mapa astral"
            fill
            className="object-cover grayscale"
            sizes="280px"
          />
        </div>
      </div>
    </CostarSection>
  );
}
