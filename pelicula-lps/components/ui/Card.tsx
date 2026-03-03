interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  light?: boolean;
}

export default function Card({ children, className = "", glow, light }: CardProps) {
  const base = light
    ? "bg-white rounded-2xl border border-black/5 p-6 md:p-8 transition-all duration-300 hover:border-black/10 shadow-sm hover:shadow-md"
    : "bg-card rounded-2xl border border-white/5 p-6 md:p-8 transition-all duration-300 hover:border-white/10 hover:bg-card-hover";

  return (
    <div
      className={`${base} ${glow ? "gold-glow" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
