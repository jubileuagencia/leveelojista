interface PlanetRowProps {
  symbol: string;
  name: string;
  sign: string;
  signEmoji: string;
  degree: number;
  house: string;
}

export default function PlanetRow({ symbol, name, sign, signEmoji, degree, house }: PlanetRowProps) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/[0.06] last:border-b-0">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-lg w-6 text-center shrink-0 opacity-60">{symbol}</span>
        <span className="font-mono text-[0.65rem] tracking-[2px] uppercase text-white/50 shrink-0">
          {name}
        </span>
      </div>
      <div className="flex items-center gap-4 text-right">
        <span className="text-white/90 text-sm font-body">
          {signEmoji} {sign}
        </span>
        <span className="font-mono text-[0.6rem] text-white/50 w-14 text-right">
          {degree.toFixed(1)}°
        </span>
        <span className="font-mono text-[0.55rem] tracking-[1px] text-white/40 w-16 text-right hidden sm:block">
          {house}
        </span>
      </div>
    </div>
  );
}
