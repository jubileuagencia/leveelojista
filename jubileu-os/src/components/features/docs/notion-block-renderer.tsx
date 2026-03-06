'use client';

import { cn } from '@/lib/utils';
import type { NotionBlock, NotionRichText } from '@/lib/notion/types';

// Render rich text with annotations
function RichText({ text }: { text: NotionRichText[] }) {
  return (
    <>
      {text.map((t, i) => {
        let content: React.ReactNode = t.plain_text;

        if (t.annotations.bold) content = <strong key={i}>{content}</strong>;
        if (t.annotations.italic) content = <em>{content}</em>;
        if (t.annotations.strikethrough) content = <s>{content}</s>;
        if (t.annotations.underline) content = <u>{content}</u>;
        if (t.annotations.code) {
          content = (
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
              {content}
            </code>
          );
        }

        if (t.href) {
          content = (
            <a
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              {content}
            </a>
          );
        }

        return <span key={i}>{content}</span>;
      })}
    </>
  );
}

function BlockChildren({ blocks }: { blocks?: NotionBlock[] }) {
  if (!blocks || blocks.length === 0) return null;
  return (
    <div className="ml-4 mt-1">
      {blocks.map((block) => (
        <NotionBlockComponent key={block.id} block={block} />
      ))}
    </div>
  );
}

function NotionBlockComponent({ block }: { block: NotionBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="mb-2 text-sm leading-relaxed">
          <RichText text={block.paragraph?.rich_text ?? []} />
          <BlockChildren blocks={block.children} />
        </p>
      );

    case 'heading_1':
      return (
        <h1 className="mb-3 mt-6 text-xl font-bold">
          <RichText text={block.heading_1?.rich_text ?? []} />
        </h1>
      );

    case 'heading_2':
      return (
        <h2 className="mb-2 mt-5 text-lg font-semibold">
          <RichText text={block.heading_2?.rich_text ?? []} />
        </h2>
      );

    case 'heading_3':
      return (
        <h3 className="mb-2 mt-4 text-base font-semibold">
          <RichText text={block.heading_3?.rich_text ?? []} />
        </h3>
      );

    case 'bulleted_list_item':
      return (
        <li className="mb-1 ml-4 list-disc text-sm">
          <RichText text={block.bulleted_list_item?.rich_text ?? []} />
          <BlockChildren blocks={block.children} />
        </li>
      );

    case 'numbered_list_item':
      return (
        <li className="mb-1 ml-4 list-decimal text-sm">
          <RichText text={block.numbered_list_item?.rich_text ?? []} />
          <BlockChildren blocks={block.children} />
        </li>
      );

    case 'to_do':
      return (
        <div className="mb-1 flex items-start gap-2 text-sm">
          <div
            className={cn(
              'mt-0.5 size-4 shrink-0 rounded border',
              block.to_do?.checked
                ? 'border-green-500 bg-green-500'
                : 'border-muted-foreground'
            )}
          />
          <span className={cn(block.to_do?.checked && 'text-muted-foreground line-through')}>
            <RichText text={block.to_do?.rich_text ?? []} />
          </span>
        </div>
      );

    case 'toggle':
      return (
        <details className="mb-2">
          <summary className="cursor-pointer text-sm font-medium">
            <RichText text={block.toggle?.rich_text ?? []} />
          </summary>
          <BlockChildren blocks={block.children} />
        </details>
      );

    case 'callout':
      return (
        <div className="mb-3 flex gap-3 rounded-md border bg-muted/30 p-3">
          {block.callout?.icon?.emoji && (
            <span className="text-lg">{block.callout.icon.emoji}</span>
          )}
          <div className="text-sm">
            <RichText text={block.callout?.rich_text ?? []} />
            <BlockChildren blocks={block.children} />
          </div>
        </div>
      );

    case 'quote':
      return (
        <blockquote className="mb-3 border-l-2 border-primary/50 pl-4 text-sm italic text-muted-foreground">
          <RichText text={block.quote?.rich_text ?? []} />
        </blockquote>
      );

    case 'code':
      return (
        <div className="mb-3">
          <div className="flex items-center justify-between rounded-t-md bg-muted px-3 py-1.5">
            <span className="text-xs text-muted-foreground">
              {block.code?.language || 'plain text'}
            </span>
          </div>
          <pre className="overflow-x-auto rounded-b-md bg-muted/50 p-3 text-sm font-mono">
            <code>
              {block.code?.rich_text.map((t) => t.plain_text).join('') ?? ''}
            </code>
          </pre>
        </div>
      );

    case 'image': {
      const url =
        block.image?.type === 'external'
          ? block.image.external?.url
          : block.image?.file?.url;
      const caption = block.image?.caption ?? [];

      return (
        <figure className="mb-3">
          {url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={caption.map((t) => t.plain_text).join('') || 'Image'}
              className="max-w-full rounded-md"
            />
          )}
          {caption.length > 0 && (
            <figcaption className="mt-1 text-xs text-muted-foreground">
              <RichText text={caption} />
            </figcaption>
          )}
        </figure>
      );
    }

    case 'divider':
      return <hr className="my-4 border-border" />;

    case 'table':
      return (
        <div className="mb-3 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <tbody>
              {block.children?.map((row, rowIdx) => (
                <tr key={row.id} className={rowIdx === 0 && block.table?.has_column_header ? 'font-medium' : ''}>
                  {row.table_row?.cells.map((cell, cellIdx) => {
                    const Tag = (rowIdx === 0 && block.table?.has_column_header) ||
                      (cellIdx === 0 && block.table?.has_row_header)
                      ? 'th'
                      : 'td';
                    return (
                      <Tag key={cellIdx} className="border border-border px-2 py-1.5 text-left">
                        <RichText text={cell} />
                      </Tag>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'bookmark':
      return (
        <a
          href={block.bookmark?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-2 block truncate rounded-md border p-2 text-sm text-primary hover:bg-muted/50"
        >
          {block.bookmark?.url}
        </a>
      );

    case 'child_page':
      return (
        <div className="mb-1 text-sm">
          <span className="mr-1">📄</span>
          {block.child_page?.title}
        </div>
      );

    case 'child_database':
      return (
        <div className="mb-1 text-sm">
          <span className="mr-1">📊</span>
          {block.child_database?.title}
        </div>
      );

    default:
      return null;
  }
}

interface NotionBlockRendererProps {
  blocks: NotionBlock[];
}

export function NotionBlockRenderer({ blocks }: NotionBlockRendererProps) {
  return (
    <div className="notion-content space-y-0.5">
      {blocks.map((block) => (
        <NotionBlockComponent key={block.id} block={block} />
      ))}
    </div>
  );
}
