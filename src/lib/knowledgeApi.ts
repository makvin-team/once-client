// Admin knowledge-base client. Talks to once-server /api/knowledge/*, which
// proxies document upload/list to ai-backend (knowledge_base collection).

import { API_BASE_URL, authFetch } from "./api";
import { tokenStore } from "../auth/tokenStore";

export type DocumentDto = {
  id: string;
  filename: string;
  contentType: string | null;
  size: number;
  embeddingStatus: string;
  chunksCount: number | null;
  collectionName: string | null;
  createdAt: string;
};

export type DocumentStats = {
  total: number;
  pending: number;
  processing: number;
  embedded: number;
  failed: number;
};

type Paged<T> = { items: T[]; total: number; page: number; size: number; pages: number };

// Upload uses a bespoke fetch (NOT authFetch): a multipart body must let the
// browser set its own Content-Type boundary, but authFetch forces
// application/json when a body is present.
export async function uploadDocument(file: File): Promise<DocumentDto> {
  const tokens = tokenStore.read();
  const headers: Record<string, string> = {};
  if (tokens?.accessToken) headers.Authorization = `Bearer ${tokens.accessToken}`;

  const body = new FormData();
  body.append("file", file, file.name);

  const res = await fetch(`${API_BASE_URL}/api/knowledge/documents`, {
    method: "POST",
    headers,
    body,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as DocumentDto;
}

export async function listDocuments(status?: string): Promise<DocumentDto[]> {
  const qs = status ? `?status=${encodeURIComponent(status)}` : "";
  const res = await authFetch(`/api/knowledge/documents${qs}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const page = (await res.json()) as Paged<DocumentDto>;
  return page.items;
}

export async function getStats(): Promise<DocumentStats> {
  const res = await authFetch(`/api/knowledge/documents/stats`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as DocumentStats;
}
