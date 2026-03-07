"use client";

import type { DocEntry } from "@/lib/docs-shared";
import { categoryLabels, categoryColors } from "@/lib/docs-shared";

function renderMarkdown(content: string): string {
  return content
    // Code blocks (must come before inline code)
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-black/30 rounded-lg p-4 overflow-x-auto text-xs my-4"><code>$2</code></pre>')
    // Headings
    .replace(/^#### (.+)$/gm, '<h4 class="text-base font-semibold text-text mt-6 mb-2">$1</h4>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-text mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-text mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-text mt-8 mb-4">$1</h1>')
    // Bold and italic
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-text font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="text-gold text-xs bg-black/20 px-1 py-0.5 rounded">$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-aspect-blue underline" target="_blank" rel="noopener">$1</a>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-text-soft">$1</li>')
    // Checkboxes
    .replace(/^- \[x\] (.+)$/gm, '<li class="ml-4 list-none text-text-soft line-through opacity-60">✅ $1</li>')
    .replace(/^- \[ \] (.+)$/gm, '<li class="ml-4 list-none text-text-soft">⬜ $1</li>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="border-white/10 my-6" />')
    // Tables (basic)
    .replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match.split("|").filter(Boolean);
      if (cells.every((c) => c.trim().match(/^[-:]+$/))) return "";
      const tds = cells.map((c) => `<td class="px-3 py-1.5 border border-white/5 text-sm">${c.trim()}</td>`).join("");
      return `<tr>${tds}</tr>`;
    })
    // Paragraphs (lines that aren't already HTML)
    .replace(/^(?!<[a-z]|$)(.+)$/gm, '<p class="text-text-soft leading-relaxed mb-2">$1</p>');
}

export default function DocumentViewer({
  content,
  entry,
}: {
  content: string;
  entry: DocEntry;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${categoryColors[entry.category]}`}>
          {categoryLabels[entry.category]}
        </span>
        <span className="text-xs text-text-muted">{entry.relativePath}</span>
        <span className="text-xs text-text-muted">{entry.sizeKb}kb</span>
      </div>

      <article
        className="prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
      />
    </div>
  );
}
