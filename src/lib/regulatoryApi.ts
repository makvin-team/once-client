// Client for the citation document viewer. Talks to once-server
// /api/assistant/regulatory/* and /api/assistant/documents/content/*, which
// proxy to ai-backend (same API key). Document bodies are fetched as blobs via
// authFetch (iframes can't carry a Bearer token) and handed back as object
// URLs the viewer embeds.

import { authFetch } from "./api";
import { sanitizeIfHtml } from "./sanitizeHtmlBlob";

// Backend `content_type` is a coarse bucket, not a MIME type.
export type RegulatoryContentType =
  | "html"
  | "pdf"
  | "docx"
  | "rtf"
  | "unknown"
  | string;

export interface RegulatoryDocumentMeta {
  id: string;
  source_id?: string | null;
  doc_number?: string | null;
  title?: string | null;
  language?: string | null;
  status?: string | null;
  content_type?: RegulatoryContentType | null;
}

export interface RegulatorySibling {
  id: string;
  language?: string | null;
  doc_number?: string | null;
}

export interface RegulatorySiblingsResponse {
  items: RegulatorySibling[];
}

export interface LoadedContent {
  url: string;
  mime: string;
  size: number;
}

async function getJson<T>(path: string): Promise<T> {
  const res = await authFetch(path);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

export function fetchRegulatoryDocument(
  documentId: string,
): Promise<RegulatoryDocumentMeta> {
  return getJson(`/api/assistant/regulatory/documents/${documentId}`);
}

export function fetchRegulatorySiblings(
  documentId: string,
): Promise<RegulatorySiblingsResponse> {
  return getJson(`/api/assistant/regulatory/documents/${documentId}/siblings`);
}

// Fetch a protected document body and return an object URL for an <iframe>.
// HTML is sanitized (scripts/handlers stripped) so the sandboxed,
// same-origin-capable iframe can't execute anything.
async function fetchContentBlob(path: string): Promise<LoadedContent> {
  const res = await authFetch(path);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const raw = await res.blob();
  const headerMime = res.headers.get("content-type") ?? raw.type ?? "";
  const { blob, mime } = await sanitizeIfHtml(raw, headerMime);
  return { url: URL.createObjectURL(blob), mime, size: blob.size };
}

export function fetchRegulatoryContent(documentId: string): Promise<LoadedContent> {
  return fetchContentBlob(
    `/api/assistant/regulatory/documents/${documentId}/content`,
  );
}

export function fetchFileContent(filename: string): Promise<LoadedContent> {
  return fetchContentBlob(
    `/api/assistant/documents/content/${encodeURIComponent(filename)}`,
  );
}
