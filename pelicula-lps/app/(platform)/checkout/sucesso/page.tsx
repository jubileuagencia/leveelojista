import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Compra realizada — Película Sideral",
  robots: "noindex",
};

export default async function CheckoutSucessoPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    payment_id?: string;
    external_reference?: string;
  }>;
}) {
  const { status } = await searchParams;
  const isPending = status === "pending" || status === "in_process";

  return (
    <div className="max-w-lg mx-auto text-center py-16">
      {isPending ? (
        <>
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-gold"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text mb-3">
            Pagamento em processamento
          </h1>
          <p className="text-text-muted mb-8">
            Estamos aguardando a confirmação do seu pagamento. Assim que for
            aprovado, seu acesso será liberado automaticamente.
          </p>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-aspect-green/10 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-aspect-green"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text mb-3">
            Compra realizada!
          </h1>
          <p className="text-text-muted mb-8">
            Seu acesso já está liberado. Bons estudos!
          </p>
        </>
      )}

      <Link
        href="/catalogo"
        className="inline-block bg-gold hover:bg-gold-light text-void font-semibold px-8 py-3 rounded-xl transition-colors"
      >
        Ir para o catálogo
      </Link>
    </div>
  );
}
