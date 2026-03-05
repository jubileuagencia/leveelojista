"use client";

export default function AuthCard({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-gold mb-2">
          Película Sideral
        </h1>
        <p className="text-text-muted text-sm">Área de membros</p>
      </div>

      <div className="bg-card border border-white/10 rounded-2xl p-8 shadow-xl">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-text mb-1">
          {title}
        </h2>
        {subtitle && (
          <p className="text-text-muted text-sm mb-6">{subtitle}</p>
        )}
        {!subtitle && <div className="mb-6" />}
        {children}
      </div>
    </div>
  );
}
