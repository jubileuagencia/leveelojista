"use client";

import { useEffect, useRef, useState } from "react";

interface ChartSVGEmbedProps {
  svg: string;
  className?: string;
}

export default function ChartSVGEmbed({ svg, className = "" }: ChartSVGEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Post-process SVG to integrate with Película theme
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const svgEl = el.querySelector("svg");
    if (!svgEl) return;

    // Make SVG responsive
    svgEl.removeAttribute("width");
    svgEl.removeAttribute("height");
    svgEl.style.width = "100%";
    svgEl.style.height = "auto";
    svgEl.style.maxWidth = "500px";
    svgEl.style.margin = "0 auto";
    svgEl.style.display = "block";
  }, [svg]);

  if (!svg) return null;

  return (
    <div
      className={`chart-svg-container transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
    >
      <div
        ref={containerRef}
        className="chart-svg-embed"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <style jsx>{`
        .chart-svg-embed :global(svg) {
          filter: drop-shadow(0 0 40px rgba(201, 162, 62, 0.08));
        }
        .chart-svg-embed :global(text) {
          font-family: "Inter", system-ui, sans-serif;
        }
      `}</style>
    </div>
  );
}
