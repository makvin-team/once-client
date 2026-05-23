// Local persistence for assistant sessions. Keyed by user id so each learner
// has their own history. When the backend is wired in, swap the load/save
// functions with API calls and keep the same shape.

import type { Citation } from "./mockAI";

export type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  citations?: ReadonlyArray<Citation>;
  followUps?: ReadonlyArray<string>;
  createdAt: string;
  feedback?: "up" | "down";
};

export type Session = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
};

const KEY_PREFIX = "once.assistant.sessions.";

function storageKey(userId: string) {
  return `${KEY_PREFIX}${userId}`;
}

export function loadSessions(userId: string): Session[] {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Session[];
  } catch {
    return [];
  }
}

export function saveSessions(userId: string, sessions: ReadonlyArray<Session>) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(sessions));
  } catch {
    /* quota / private mode */
  }
}

// Seed conversations shown the first time a user opens the assistant. They
// give reviewers something to click into without typing.
export function seedSessions(userId: string): Session[] {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 4);

  return [
    {
      id: `seed_${userId}_1`,
      title: "AML red flag'lar ro'yxati",
      createdAt: lastWeek.toISOString(),
      updatedAt: lastWeek.toISOString(),
      messages: [
        {
          id: "m1",
          role: "user",
          text: "AML red flag'lar nima va kim eskalatsiya qiladi?",
          createdAt: lastWeek.toISOString(),
        },
        {
          id: "m2",
          role: "assistant",
          text:
            "AML reglamenti bo'yicha asosiy red-flag'lar: katta naqd to'lov noaniq manbadan, qisqa muddatda ko'p kichik tranzaksiyalar, hujjat / shaxs nomuvofiqligi, mijozning savollardan qochishi. Compliance bo'limiga eskalatsiya operator tomonidan amalga oshiriladi.",
          citations: [
            {
              docId: "doc_aml_reg",
              title: "AML reglamenti v2.4",
              section: "2.1 Red flags",
            },
          ],
          createdAt: lastWeek.toISOString(),
        },
      ],
    },
    {
      id: `seed_${userId}_2`,
      title: "ABS transfer workflow",
      createdAt: yesterday.toISOString(),
      updatedAt: yesterday.toISOString(),
      messages: [
        {
          id: "m1",
          role: "user",
          text: "ABS'da transfer workflow qanday ko'rinishda?",
          createdAt: yesterday.toISOString(),
        },
        {
          id: "m2",
          role: "assistant",
          text:
            "ABS transfer workflow: 1) operator ABS'da operatsiya ochadi, 2) mijoz tasdiqlanadi, 3) limit tekshiriladi, 4) compliance hook ishlaydi, 5) operatsiya bajariladi va kvitansiya chiqariladi.",
          citations: [
            {
              docId: "doc_abs_manual",
              title: "ABS foydalanuvchi qo'llanma",
              section: "Transfer flow",
            },
          ],
          createdAt: yesterday.toISOString(),
        },
      ],
    },
  ];
}

export function makeNewSession(): Session {
  const now = new Date().toISOString();
  return {
    id: `s_${Math.random().toString(36).slice(2, 10)}`,
    title: "",
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function makeId() {
  return `m_${Math.random().toString(36).slice(2, 10)}`;
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
