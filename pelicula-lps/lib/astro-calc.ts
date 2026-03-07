import type { SignKey } from "./astro-constants";

/** Order of zodiac signs for degree calculation (Aries = 0) */
export const SIGN_ORDER: SignKey[] = [
  "Ari", "Tau", "Gem", "Can", "Leo", "Vir",
  "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis",
];

/** Element colors for the Película theme */
export const ELEMENT_COLORS: Record<string, { bg: string; text: string }> = {
  fire:  { bg: "rgba(201, 162, 62, 0.15)", text: "#c9a23e" },   // gold
  earth: { bg: "rgba(91, 194, 126, 0.12)", text: "#5bc27e" },   // green
  air:   { bg: "rgba(91, 126, 194, 0.12)", text: "#5b7ec2" },   // blue
  water: { bg: "rgba(107, 79, 160, 0.15)", text: "#9b7fd4" },   // purple
};

/** Map each sign to its element */
export const SIGN_ELEMENTS: Record<SignKey, string> = {
  Ari: "fire", Leo: "fire", Sag: "fire",
  Tau: "earth", Vir: "earth", Cap: "earth",
  Gem: "air", Lib: "air", Aqu: "air",
  Can: "water", Sco: "water", Pis: "water",
};

/** Aspect definitions with standard orbs */
export const ASPECTS = [
  { name: "Conjunção", angle: 0, orb: 8, color: "#c9a23e", dash: "" },
  { name: "Sextil", angle: 60, orb: 6, color: "#5bc27e", dash: "4 4" },
  { name: "Quadratura", angle: 90, orb: 8, color: "#c25b5b", dash: "" },
  { name: "Trígono", angle: 120, orb: 8, color: "#5b7ec2", dash: "" },
  { name: "Oposição", angle: 180, orb: 8, color: "#9b7fd4", dash: "8 4" },
] as const;

/** Convert sign key + degree within sign → absolute zodiac degree (0-360) */
export function signToAbsDegree(signKey: SignKey, degreeInSign: number): number {
  const idx = SIGN_ORDER.indexOf(signKey);
  if (idx === -1) return 0;
  return idx * 30 + degreeInSign;
}

/** Degrees → radians */
export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Polar coordinates → cartesian, with 0° at 9 o'clock (AC position) going counterclockwise */
export function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
): { x: number; y: number } {
  // Astrological convention: 0° Aries at 9 o'clock, going counterclockwise
  const rad = degToRad(180 - angleDeg);
  return {
    x: cx + r * Math.cos(rad),
    y: cy - r * Math.sin(rad),
  };
}

/** Generate SVG arc path */
export function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const sweep = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${sweep} 1 ${end.x} ${end.y}`;
}

/** Calculate angular difference (shortest arc) */
function angleDiff(a: number, b: number): number {
  let diff = Math.abs(a - b) % 360;
  if (diff > 180) diff = 360 - diff;
  return diff;
}

export interface CalculatedAspect {
  planet1Key: string;
  planet2Key: string;
  aspectName: string;
  angle: number;
  orb: number;
  exactAngle: number;
  color: string;
  dash: string;
}

/** Calculate aspects between planets based on their absolute degrees */
export function calcAspects(
  planets: Array<{ key: string; absDegree?: number; signKey: string; degree: number }>,
): CalculatedAspect[] {
  const results: CalculatedAspect[] = [];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];

      const deg1 = p1.absDegree ?? signToAbsDegree(p1.signKey as SignKey, p1.degree);
      const deg2 = p2.absDegree ?? signToAbsDegree(p2.signKey as SignKey, p2.degree);

      const diff = angleDiff(deg1, deg2);

      for (const aspect of ASPECTS) {
        const orb = Math.abs(diff - aspect.angle);
        if (orb <= aspect.orb) {
          results.push({
            planet1Key: p1.key,
            planet2Key: p2.key,
            aspectName: aspect.name,
            angle: aspect.angle,
            orb: Math.round(orb * 100) / 100,
            exactAngle: diff,
            color: aspect.color,
            dash: aspect.dash,
          });
          break; // one aspect per pair
        }
      }
    }
  }

  return results;
}
