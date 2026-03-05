import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display, Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Película Sideral",
  description: "Astrologia, cinema e design de informação.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${inter.variable} ${spaceMono.variable}`}
    >
      <body>{children}</body>
      {/* Pixel X App — rastreamento integrado com Meta Ads */}
      <Script
        id="pixel-x"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `!function(){var e=window.location.href,t=document.title,n=Date.now(),o=document.createElement('script');o.src='https://pxa.peliculasideral.com.br/remote?url='+encodeURIComponent(e)+'&title='+encodeURIComponent(t)+'&time='+n,o.async=!0,document.head.appendChild(o)}()`,
        }}
      />
    </html>
  );
}
