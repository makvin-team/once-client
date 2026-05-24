// Assistant session model + server-backed loaders. Sessions map 1:1 to
// ai-backend conversations (via once-server). A brand-new chat has no
// conversationId until the first `done` event returns one.

import type { RegulatorySource } from "./citationParser";
import {
  listConversations,
  getMessages,
  type LoadedMessage,
} from "./assistantApi";

export type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  regulatorySources?: ReadonlyArray<RegulatorySource>;
  sources?: ReadonlyArray<string>;
  followUps?: ReadonlyArray<string>;
  createdAt: string;
  feedback?: "up" | "down";
};

export type Session = {
  id: string;                 // local id; equals conversationId once persisted
  conversationId?: string;    // ai-backend conversation id (undefined until first done)
  title: string;
  messages: Message[];
  loaded: boolean;            // whether messages have been fetched from the server
  createdAt: string;
  updatedAt: string;
};

export function makeId() {
  return `m_${Math.random().toString(36).slice(2, 10)}`;
}

export function makeNewSession(): Session {
  const now = new Date().toISOString();
  return {
    id: `s_${Math.random().toString(36).slice(2, 10)}`,
    conversationId: undefined,
    title: "",
    messages: [],
    loaded: true, // a new empty chat needs no fetch
    createdAt: now,
    updatedAt: now,
  };
}

// Load the conversation list (without messages) from the server.
export async function fetchSessions(): Promise<Session[]> {
  const conversations = await listConversations();
  return conversations.map((c) => ({
    id: c.id,
    conversationId: c.id,
    title: c.title,
    messages: [],
    loaded: false,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }));
}

// Fetch messages for one conversation and map to UI Message[].
export async function fetchMessages(conversationId: string): Promise<Message[]> {
  const loaded: LoadedMessage[] = await getMessages(conversationId);
  return loaded.map((m) => ({
    id: makeId(),
    role: m.role,
    text: m.text,
    regulatorySources: m.regulatorySources,
    sources: m.sources,
    createdAt: m.createdAt,
  }));
}

// Group sessions by relative time bucket (today / yesterday / this week / older).
export type SessionGroup = "today" | "yesterday" | "thisWeek" | "older";

export function groupOf(session: Session): SessionGroup {
  const date = new Date(session.updatedAt);
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 6);

  if (date >= startOfToday) return "today";
  if (date >= startOfYesterday) return "yesterday";
  if (date >= startOfWeek) return "thisWeek";
  return "older";
}
