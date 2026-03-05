"use client";

export default function ProgressBar({
  percent,
  className = "",
}: {
  percent: number;
  className?: string;
}) {
  return (
    <div
      className={`h-1 bg-white/10 rounded-full overflow-hidden ${className}`}
    >
      <div
        className="h-full bg-gold rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
}
