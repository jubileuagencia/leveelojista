"use client";

import { useState, useMemo } from "react";
import {
  SIGN_ORDER,
  SIGN_ELEMENTS,
  ELEMENT_COLORS,
  polarToCartesian,
  describeArc,
  calcAspects,
  signToAbsDegree,
  type CalculatedAspect,
} from "@/lib/astro-calc";
import { SIGN_EMOJIS, PLANET_SYMBOLS, type SignKey } from "@/lib/astro-constants";

interface PlanetData {
  key: string;
  name: string;
  symbol: string;
  sign: string;
  signEmoji: string;
  signKey: string;
  degree: number;
  absDegree?: number;
  house: string;
  retrograde?: boolean;
}

interface NatalChartProps {
  planets: PlanetData[];
  houseCusps?: number[];
  ascendantDegree?: number;
  size?: number;
  interactive?: boolean;
  showAspects?: boolean;
  className?: string;
}

interface TooltipState {
  x: number;
  y: number;
  content: string;
  subtext?: string;
}

// Default equal house cusps (every 30°) starting from 0° Aries
const DEFAULT_CUSPS = Array.from({ length: 12 }, (_, i) => i * 30);

export default function NatalChart({
  planets,
  houseCusps,
  ascendantDegree = 0,
  size = 400,
  interactive = true,
  showAspects = true,
  className = "",
}: NatalChartProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [highlightPlanet, setHighlightPlanet] = useState<string | null>(null);

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 8;
  const zodiacOuterR = outerR;
  const zodiacInnerR = outerR * 0.82;
  const houseR = zodiacInnerR;
  const planetR = outerR * 0.62;
  const aspectR = outerR * 0.42;
  const innerCircleR = outerR * 0.25;

  const cusps = houseCusps && houseCusps.length === 12 ? houseCusps : DEFAULT_CUSPS;

  // Rotation offset: rotate chart so AC is at 9 o'clock (left)
  const rotation = ascendantDegree;

  const aspects = useMemo(() => {
    if (!showAspects) return [];
    return calcAspects(planets);
  }, [planets, showAspects]);

  // Resolve planet positions with collision avoidance
  const planetPositions = useMemo(() => {
    const positions = planets.map((p) => {
      const absDeg = p.absDegree ?? signToAbsDegree(p.signKey as SignKey, p.degree);
      return { ...p, absDeg };
    });

    // Sort by degree for collision detection
    positions.sort((a, b) => a.absDeg - b.absDeg);

    // Spread overlapping planets (within 6° of each other)
    const minSpacing = 8;
    for (let i = 1; i < positions.length; i++) {
      let diff = positions[i].absDeg - positions[i - 1].absDeg;
      if (diff < 0) diff += 360;
      if (diff < minSpacing) {
        positions[i] = {
          ...positions[i],
          absDeg: (positions[i - 1].absDeg + minSpacing) % 360,
        };
      }
    }

    return positions;
  }, [planets]);

  function handlePlanetHover(
    e: React.MouseEvent<SVGElement>,
    planet: PlanetData & { absDeg: number },
  ) {
    if (!interactive) return;
    const rect = (e.currentTarget.closest("svg") as SVGSVGElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTooltip({
      x,
      y: y - 10,
      content: `${planet.symbol} ${planet.name} em ${planet.signEmoji} ${planet.sign}`,
      subtext: `${planet.degree.toFixed(1)}° · ${planet.house}${planet.retrograde ? " · Retrógrado ℞" : ""}`,
    });
    setHighlightPlanet(planet.key);
  }

  function handleAspectHover(
    e: React.MouseEvent<SVGElement>,
    aspect: CalculatedAspect,
  ) {
    if (!interactive) return;
    const rect = (e.currentTarget.closest("svg") as SVGSVGElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const p1 = planets.find((p) => p.key === aspect.planet1Key);
    const p2 = planets.find((p) => p.key === aspect.planet2Key);
    setTooltip({
      x,
      y: y - 10,
      content: `${aspect.aspectName}`,
      subtext: `${p1?.symbol ?? ""} ${p1?.name ?? ""} ↔ ${p2?.symbol ?? ""} ${p2?.name ?? ""} · orbe ${aspect.orb}°`,
    });
  }

  function handleMouseLeave() {
    setTooltip(null);
    setHighlightPlanet(null);
  }

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        height="auto"
        style={{ maxWidth: `${size}px`, margin: "0 auto", display: "block" }}
        onMouseLeave={handleMouseLeave}
      >
        {/* Definitions */}
        <defs>
          <filter id="planet-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="aspect-glow">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background circle */}
        <circle cx={cx} cy={cy} r={outerR} fill="rgba(5, 5, 16, 0.6)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

        {/* Zodiac Ring — 12 sign segments */}
        {SIGN_ORDER.map((signKey, i) => {
          const startAngle = i * 30 + rotation;
          const endAngle = startAngle + 30;
          const element = SIGN_ELEMENTS[signKey];
          const colors = ELEMENT_COLORS[element];

          const pathD = [
            describeArc(cx, cy, zodiacOuterR, startAngle, endAngle),
            `L ${polarToCartesian(cx, cy, zodiacInnerR, endAngle).x} ${polarToCartesian(cx, cy, zodiacInnerR, endAngle).y}`,
            describeArc(cx, cy, zodiacInnerR, endAngle, startAngle).replace("M", "L").split("A").map((s, idx) => idx === 0 ? s : "A" + s).join(""),
            "Z",
          ].join(" ");

          // Fix the inner arc — draw it separately
          const outerArc = describeArc(cx, cy, zodiacOuterR, startAngle, endAngle);
          const innerEnd = polarToCartesian(cx, cy, zodiacInnerR, endAngle);
          const innerStart = polarToCartesian(cx, cy, zodiacInnerR, startAngle);
          const outerEnd = polarToCartesian(cx, cy, zodiacOuterR, endAngle);

          // Build proper segment path
          const segPath = `${outerArc} L ${innerEnd.x} ${innerEnd.y} A ${zodiacInnerR} ${zodiacInnerR} 0 0 0 ${innerStart.x} ${innerStart.y} L ${polarToCartesian(cx, cy, zodiacOuterR, startAngle).x} ${polarToCartesian(cx, cy, zodiacOuterR, startAngle).y} Z`;

          // Sign glyph position at segment center
          const midAngle = startAngle + 15;
          const glyphR = (zodiacOuterR + zodiacInnerR) / 2;
          const glyphPos = polarToCartesian(cx, cy, glyphR, midAngle);

          // Divider line
          const divStart = polarToCartesian(cx, cy, zodiacOuterR, startAngle);
          const divEnd = polarToCartesian(cx, cy, zodiacInnerR, startAngle);

          return (
            <g key={signKey}>
              <path
                d={segPath}
                fill={colors.bg}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="0.5"
              />
              <line
                x1={divStart.x} y1={divStart.y}
                x2={divEnd.x} y2={divEnd.y}
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="0.5"
              />
              <text
                x={glyphPos.x}
                y={glyphPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={size * 0.035}
                fill={colors.text}
                style={{ pointerEvents: "none" }}
              >
                {SIGN_EMOJIS[signKey]}
              </text>
            </g>
          );
        })}

        {/* House divisions */}
        {cusps.map((cuspDeg, i) => {
          const angle = cuspDeg + rotation;
          const outerPt = polarToCartesian(cx, cy, zodiacInnerR, angle);
          const innerPt = polarToCartesian(cx, cy, innerCircleR, angle);
          const isCardinal = i === 0 || i === 3 || i === 6 || i === 9;

          return (
            <line
              key={`cusp-${i}`}
              x1={outerPt.x} y1={outerPt.y}
              x2={innerPt.x} y2={innerPt.y}
              stroke={isCardinal ? "rgba(201, 162, 62, 0.4)" : "rgba(255,255,255,0.1)"}
              strokeWidth={isCardinal ? 1.5 : 0.5}
            />
          );
        })}

        {/* House numbers */}
        {cusps.map((cuspDeg, i) => {
          const nextCusp = cusps[(i + 1) % 12];
          let midAngle = (cuspDeg + nextCusp) / 2;
          if (nextCusp < cuspDeg) midAngle = ((cuspDeg + nextCusp + 360) / 2) % 360;
          const angle = midAngle + rotation;
          const numR = (zodiacInnerR + innerCircleR) / 2 + outerR * 0.08;
          const pos = polarToCartesian(cx, cy, numR, angle);

          return (
            <text
              key={`house-num-${i}`}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={size * 0.025}
              fill="rgba(255,255,255,0.25)"
              fontFamily="Inter, system-ui, sans-serif"
              style={{ pointerEvents: "none" }}
            >
              {i + 1}
            </text>
          );
        })}

        {/* Inner circle */}
        <circle cx={cx} cy={cy} r={innerCircleR} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />

        {/* Aspect lines */}
        {showAspects && aspects.map((aspect, i) => {
          const p1 = planetPositions.find((p) => p.key === aspect.planet1Key);
          const p2 = planetPositions.find((p) => p.key === aspect.planet2Key);
          if (!p1 || !p2) return null;

          const pos1 = polarToCartesian(cx, cy, aspectR, p1.absDeg + rotation);
          const pos2 = polarToCartesian(cx, cy, aspectR, p2.absDeg + rotation);

          const isHighlighted = highlightPlanet === aspect.planet1Key || highlightPlanet === aspect.planet2Key;
          const opacity = highlightPlanet
            ? isHighlighted ? 0.7 : 0.08
            : 0.3;

          return (
            <line
              key={`aspect-${i}`}
              x1={pos1.x} y1={pos1.y}
              x2={pos2.x} y2={pos2.y}
              stroke={aspect.color}
              strokeWidth={isHighlighted ? 1.5 : 0.8}
              strokeDasharray={aspect.dash}
              opacity={opacity}
              filter={isHighlighted ? "url(#aspect-glow)" : undefined}
              style={{ cursor: interactive ? "pointer" : "default", transition: "opacity 0.3s" }}
              onMouseEnter={(e) => handleAspectHover(e, aspect)}
              onMouseLeave={handleMouseLeave}
            />
          );
        })}

        {/* Planets */}
        {planetPositions.map((planet) => {
          const angle = planet.absDeg + rotation;
          const pos = polarToCartesian(cx, cy, planetR, angle);
          const isHighlighted = highlightPlanet === planet.key;
          const dimmed = highlightPlanet && !isHighlighted;

          return (
            <g
              key={planet.key}
              style={{ cursor: interactive ? "pointer" : "default" }}
              onMouseEnter={(e) => handlePlanetHover(e, planet)}
              onMouseLeave={handleMouseLeave}
              onClick={() => interactive && setHighlightPlanet(
                highlightPlanet === planet.key ? null : planet.key
              )}
            >
              {/* Planet background circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={size * 0.032}
                fill={isHighlighted ? "rgba(201, 162, 62, 0.2)" : "rgba(5, 5, 16, 0.8)"}
                stroke={isHighlighted ? "#c9a23e" : "rgba(255,255,255,0.15)"}
                strokeWidth={isHighlighted ? 1.5 : 0.8}
                style={{ transition: "all 0.3s" }}
              />
              {/* Planet glyph */}
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={size * 0.032}
                fill={dimmed ? "rgba(255,255,255,0.3)" : "#e4e0d8"}
                filter={isHighlighted ? "url(#planet-glow)" : undefined}
                style={{ pointerEvents: "none", transition: "fill 0.3s" }}
              >
                {PLANET_SYMBOLS[planet.key] ?? planet.symbol}
              </text>
              {/* Retrograde marker */}
              {planet.retrograde && (
                <text
                  x={pos.x + size * 0.028}
                  y={pos.y - size * 0.028}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={size * 0.018}
                  fill="#c25b5b"
                  style={{ pointerEvents: "none" }}
                >
                  ℞
                </text>
              )}
            </g>
          );
        })}

        {/* AC marker */}
        {(() => {
          const acAngle = ascendantDegree + rotation;
          const acOuter = polarToCartesian(cx, cy, zodiacInnerR + 2, acAngle);
          const acInner = polarToCartesian(cx, cy, innerCircleR - 4, acAngle);
          const labelPos = polarToCartesian(cx, cy, zodiacInnerR + size * 0.06, acAngle);
          return (
            <g>
              <line
                x1={acOuter.x} y1={acOuter.y}
                x2={acInner.x} y2={acInner.y}
                stroke="#c9a23e"
                strokeWidth="2"
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={size * 0.028}
                fill="#c9a23e"
                fontWeight="bold"
                fontFamily="Inter, system-ui, sans-serif"
                style={{ pointerEvents: "none" }}
              >
                AC
              </text>
            </g>
          );
        })()}
      </svg>

      {/* Tooltip */}
      {tooltip && interactive && (
        <div
          className="absolute pointer-events-none z-50"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="bg-card border border-white/10 rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
            <p className="text-white/90 text-xs font-body">{tooltip.content}</p>
            {tooltip.subtext && (
              <p className="text-white/50 text-[0.65rem] font-mono mt-0.5">{tooltip.subtext}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
