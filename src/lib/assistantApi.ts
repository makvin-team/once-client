// AI assistant backend client. Talks to once-server /api/assistant/*, which
// proxies to ai-backend and holds the api-key. Streaming uses fetch + a
// ReadableStream reader (EventSource can't POST or send auth headers).

import { API_BASE_URL, authFetch } from "./api";
import { tokenStore } from "../auth/tokenStore";
import type { RegulatorySource } from "./citationParser";

// ----- Server response shapes (once-server camelCase) -----

type ConversationDto = {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
};

type MessageDto = {
  id: string;
  conversationId: string;
  question: string;
  answer: string;
  sources: string | null;
  regulatorySources: RegulatorySource[] | null;
  createdAt: string;
};

type Paged<T> = { items: T[]; total: number; page: number; size: number; pages: number };

// RegulatorySource (snake_case keys, straight from ai-backend — once-server
// proxies them as-is) is defined in ./citationParser, which owns the citation
// matching logic that consumes these fields.

// ----- SSE event shapes (verbatim from ai-backend) -----

export type StreamHandlers = {
  onToolCall?: (name: string, query: string) => void;
  onChunk: (token: string) => void;
  onSources?: (sources: { regulatory: RegulatorySource[]; files: string[] }) => void;
  onTruncated?: () => void;
  onDone: (conversationId: string, title: string | null) => void;
  onError: (message: string) => void;
};

function authHeaders(): Record<string, string> {
  const tokens = tokenStore.read();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (tokens?.accessToken) headers.Authorization = `Bearer ${tokens.accessToken}`;
  return headers;
}

/**
 * Streams a chat turn. Returns a function to abort the request.
 */
export function streamChat(
  payload: { conversationId?: string; message: string },
  handlers: StreamHandlers,
): () => void {
  const controller = new AbortController();

  (async () => {
    let res: Response;
    try {
      res = await fetch(`${API_BASE_URL}/api/assistant/chat/stream`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          conversationId: payload.conversationId ?? null,
          message: payload.message,
        }),
        signal: controller.signal,
      });
    } catch {
      if (controller.signal.aborted) return; // user-initiated abort, stay silent
      handlers.onError("network");
      return;
    }

    if (!res.ok || !res.body) {
      handlers.onError(`HTTP ${res.status}`);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // SSE events are separated by a blank line.
        let sep: number;
        while ((sep = buffer.indexOf("\n\n")) !== -1) {
          const rawEvent = buffer.slice(0, sep);
          buffer = buffer.slice(sep + 2);
          handleSseEvent(rawEvent, handlers);
        }
      }
    } catch {
      if (!controller.signal.aborted) handlers.onError("stream");
    }
  })();

  return () => controller.abort();
}

function handleSseEvent(rawEvent: string, handlers: StreamHandlers) {
  // An event may contain one or more `data:` lines; ai-backend sends one.
  const dataLine = rawEvent
    .split("\n")
    .find((l) => l.startsWith("data:"));
  if (!dataLine) return;

  const json = dataLine.slice("data:".length).trim();
  if (!json) return;

  let evt: Record<string, unknown>;
  try {
    evt = JSON.parse(json);
  } catch {
    return;
  }

  switch (evt.type) {
    case "tool_call":
      handlers.onToolCall?.(String(evt.name ?? ""), String(evt.query ?? ""));
      break;
    case "chunk":
      handlers.onChunk(String(evt.content ?? ""));
      break;
    case "sources": {
      const reg = (evt.regulatory_sources as RegulatorySource[] | undefined) ?? [];
      const files = (evt.sources as string[] | undefined) ?? [];
      handlers.onSources?.({ regulatory: reg, files });
      break;
    }
    case "truncated":
      handlers.onTruncated?.();
      break;
    case "done":
      handlers.onDone(
        String(evt.conversation_id ?? ""),
        (evt.title as string | null) ?? null,
      );
      break;
    case "error":
      handlers.onError(String(evt.message ?? "error"));
      break;
  }
}

// ----- History (non-streaming) -----

async function getJson<T>(path: string): Promise<T> {
  // authFetch attaches the Bearer token and transparently refreshes on 401.
  const res = await authFetch(path);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

export type ConversationSummary = {
  id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
};

export async function listConversations(): Promise<ConversationSummary[]> {
  const page = await getJson<Paged<ConversationDto>>("/api/assistant/conversations");
  return page.items.map((c) => ({
    id: c.id,
    title: c.title ?? "",
    updatedAt: c.updatedAt,
    createdAt: c.createdAt,
  }));
}

export type LoadedMessage = {
  role: "user" | "assistant";
  text: string;
  regulatorySources?: RegulatorySource[];
  sources?: string[];
  createdAt: string;
};

export async function getMessages(conversationId: string): Promise<LoadedMessage[]> {
  // TODO: only the first page is read. once-server requests a large upstream page
  // size, so this covers normal conversations; paginate for very long ones.
  const page = await getJson<Paged<MessageDto>>(
    `/api/assistant/conversations/${conversationId}/messages`,
  );
  // ai-backend returns messages newest-first (created_at desc); render the
  // conversation oldest-first so it reads top-to-bottom.
  const items = [...page.items].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  const out: LoadedMessage[] = [];
  for (const m of items) {
    out.push({ role: "user", text: m.question, createdAt: m.createdAt });
    out.push({
      role: "assistant",
      text: m.answer,
      regulatorySources: m.regulatorySources ?? [],
      // ai-backend persists file sources as a ", "-joined string.
      sources: m.sources
        ? m.sources.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      createdAt: m.createdAt,
    });
  }
  return out;
}

export async function deleteConversation(conversationId: string): Promise<void> {
  const res = await authFetch(`/api/assistant/conversations/${conversationId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
