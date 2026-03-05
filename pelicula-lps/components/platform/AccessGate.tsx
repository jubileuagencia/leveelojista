"use client";

import Link from "next/link";

export default function AccessGate({
  courseTitle,
}: {
  courseTitle: string;
}) {
  return (
    <div className="relative rounded-xl overflow-hidden">
      {/* Blurred overlay */}
      <div className="absolute inset-0 bg-void/80 backdrop-blur-md z-10 flex items-center justify-center">
        <div className="text-center px-6 max-w-md">
          <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-gold"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-text mb-2">
            Conteúdo exclusivo
          </h3>
          <p className="text-text-muted text-sm mb-4">
            Adquira o acesso a <strong className="text-text">{courseTitle}</strong>{" "}
            para assistir todas as aulas.
          </p>
          <Link
            href="/checkout"
            className="inline-block bg-gold hover:bg-gold-light text-void font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            Ver planos
          </Link>
        </div>
      </div>

      {/* Fake content behind blur */}
      <div className="aspect-video bg-deep" />
    </div>
  );
}
