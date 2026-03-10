// Notion API types (simplified for our use case)

export interface NotionPage {
  id: string;
  object: 'page';
  created_time: string;
  last_edited_time: string;
  archived: boolean;
  url: string;
  icon: NotionIcon | null;
  cover: NotionFile | null;
  parent: NotionParent;
  properties: Record<string, NotionProperty>;
}

export interface NotionIcon {
  type: 'emoji' | 'external' | 'file';
  emoji?: string;
  external?: { url: string };
  file?: { url: string };
}

export interface NotionFile {
  type: 'external' | 'file';
  external?: { url: string };
  file?: { url: string; expiry_time: string };
}

export type NotionParent =
  | { type: 'database_id'; database_id: string }
  | { type: 'page_id'; page_id: string }
  | { type: 'workspace'; workspace: true };

export interface NotionProperty {
  id: string;
  type: string;
  title?: NotionRichText[];
  rich_text?: NotionRichText[];
  [key: string]: unknown;
}

export interface NotionRichText {
  type: 'text' | 'mention' | 'equation';
  text?: { content: string; link: { url: string } | null };
  mention?: unknown;
  equation?: { expression: string };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href: string | null;
}

export type NotionBlockType =
  | 'paragraph'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'bulleted_list_item'
  | 'numbered_list_item'
  | 'to_do'
  | 'toggle'
  | 'callout'
  | 'quote'
  | 'code'
  | 'image'
  | 'video'
  | 'divider'
  | 'table'
  | 'table_row'
  | 'bookmark'
  | 'embed'
  | 'child_page'
  | 'child_database'
  | 'synced_block'
  | 'column_list'
  | 'column';

export interface NotionBlock {
  id: string;
  object: 'block';
  type: NotionBlockType;
  created_time: string;
  last_edited_time: string;
  has_children: boolean;
  archived: boolean;
  // Block-specific content
  paragraph?: { rich_text: NotionRichText[]; color: string };
  heading_1?: { rich_text: NotionRichText[]; color: string; is_toggleable: boolean };
  heading_2?: { rich_text: NotionRichText[]; color: string; is_toggleable: boolean };
  heading_3?: { rich_text: NotionRichText[]; color: string; is_toggleable: boolean };
  bulleted_list_item?: { rich_text: NotionRichText[]; color: string };
  numbered_list_item?: { rich_text: NotionRichText[]; color: string };
  to_do?: { rich_text: NotionRichText[]; checked: boolean; color: string };
  toggle?: { rich_text: NotionRichText[]; color: string };
  callout?: { rich_text: NotionRichText[]; icon: NotionIcon; color: string };
  quote?: { rich_text: NotionRichText[]; color: string };
  code?: { rich_text: NotionRichText[]; caption: NotionRichText[]; language: string };
  image?: NotionFile & { caption: NotionRichText[] };
  divider?: Record<string, never>;
  table?: { table_width: number; has_column_header: boolean; has_row_header: boolean };
  table_row?: { cells: NotionRichText[][] };
  bookmark?: { url: string; caption: NotionRichText[] };
  child_page?: { title: string };
  child_database?: { title: string };
  // Children (loaded separately)
  children?: NotionBlock[];
}

export interface NotionSearchResult {
  id: string;
  title: string;
  icon: NotionIcon | null;
  lastEdited: string;
  parent: NotionParent;
  url: string;
}

export interface NotionSearchResponse {
  results: NotionSearchResult[];
  has_more: boolean;
  next_cursor: string | null;
}

export interface CreatePageBody {
  parentId: string;
  title: string;
  parentType?: 'page' | 'database';
}
