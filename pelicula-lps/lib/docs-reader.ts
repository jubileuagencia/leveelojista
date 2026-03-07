import fs from "fs";
import path from "path";
import type { DocCategory, DocEntry } from "./docs-shared";

export type { DocCategory, DocEntry };
export { categoryLabels, categoryColors } from "./docs-shared";

function getDocsRoot(): string {
  return path.resolve(process.cwd(), "..", "docs");
}

function categorizeFromPath(relativePath: string): DocCategory {
  const first = relativePath.split("/")[0]?.toLowerCase();
  const categoryMap: Record<string, DocCategory> = {
    stories: "stories",
    "prd-sistema-operacional": "prd",
    architecture: "architecture",
    entregas: "entregas",
    templates: "templates",
    roteiros: "roteiros",
  };
  return categoryMap[first] || "geral";
}

function titleFromFileName(fileName: string): string {
  return fileName
    .replace(/\.md$/, "")
    .replace(/\.story$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function listFilesRecursive(dir: string, base: string = ""): string[] {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const relative = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...listFilesRecursive(path.join(dir, entry.name), relative));
    } else if (entry.name.endsWith(".md")) {
      files.push(relative);
    }
  }

  return files;
}

export function listDocs(): DocEntry[] {
  const docsRoot = getDocsRoot();
  const relativePaths = listFilesRecursive(docsRoot);

  return relativePaths.map((relativePath) => {
    const fullPath = path.join(docsRoot, relativePath);
    const stat = fs.statSync(fullPath);
    const fileName = path.basename(relativePath);

    return {
      slug: relativePath.replace(/\.md$/, ""),
      title: titleFromFileName(fileName),
      category: categorizeFromPath(relativePath),
      fileName,
      relativePath,
      sizeKb: Math.round(stat.size / 1024),
    };
  });
}

export function readDoc(slug: string): { content: string; entry: DocEntry } | null {
  const docsRoot = getDocsRoot();
  const filePath = path.join(docsRoot, `${slug}.md`);

  if (!fs.existsSync(filePath)) return null;

  // Prevent directory traversal
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(docsRoot))) return null;

  const content = fs.readFileSync(filePath, "utf-8");
  const stat = fs.statSync(filePath);
  const fileName = path.basename(filePath);
  const relativePath = `${slug}.md`;

  return {
    content,
    entry: {
      slug,
      title: titleFromFileName(fileName),
      category: categorizeFromPath(relativePath),
      fileName,
      relativePath,
      sizeKb: Math.round(stat.size / 1024),
    },
  };
}
