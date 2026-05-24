import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/app/icons";
import { AILogo } from "../../components/ui/AILogo";
import { useAuth } from "../../auth/AuthProvider";
import { useT } from "../../i18n";
import { track } from "../../lib/analytics";
import { cn } from "../../lib/cn";
import {
  type Message,
  type Session,
  type SessionGroup,
  groupOf,
  makeId,
  makeNewSession,
  fetchSessions,
  fetchMessages,
} from "../../lib/assistantStore";
import { streamChat, deleteConversation } from "../../lib/assistantApi";
import { titleFromPrompt } from "../../lib/mockAI";
import { AssistantAnswer } from "./AssistantAnswer";

const GROUP_ORDER: SessionGroup[] = ["today", "yesterday", "thisWeek", "older"];

export function LearnerAssistant() {
  const { user } = useAuth();
  const t = useT();
  const copy = t.app.assistant;

  const userId = user?.id ?? "anonymous";

  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [showSessionsOnMobile, setShowSessionsOnMobile] = useState(false);

  const messagesRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const abortStreamRef = useRef<(() => void) | null>(null);

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeId) ?? null,
    [sessions, activeId],
  );

  // Initial load: fetch the user's conversation list from the server.
  useEffect(() => {
    let cancelled = false;
    fetchSessions()
      .then((loaded) => {
        if (cancelled) return;
        setSessions(loaded);
        setActiveId(loaded[0]?.id ?? null);
      })
      .catch(() => {
        /* leave empty; user can start a new chat */
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Lazily fetch messages when an unloaded session becomes active. Depend on
  // scalar fields (not the whole sessions array) so streaming token updates,
  // which change messages but not loaded/conversationId, don't re-run this.
  const activeLoaded = activeSession?.loaded ?? true;
  const activeConversationId = activeSession?.conversationId;
  useEffect(() => {
    if (activeLoaded || !activeConversationId || activeId == null) return;
    const sessionId = activeId;
    let cancelled = false;
    fetchMessages(activeConversationId)
      .then((messages) => {
        if (cancelled) return;
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId ? { ...s, messages, loaded: true } : s,
          ),
        );
      })
      .catch(() => {
        setSessions((prev) =>
          prev.map((s) => (s.id === sessionId ? { ...s, loaded: true } : s)),
        );
      });
    return () => {
      cancelled = true;
    };
  }, [activeId, activeLoaded, activeConversationId]);

  // Auto-scroll to bottom when messages change.
  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [activeSession?.messages.length, pending]);

  // Abort any in-flight stream when the component unmounts.
  useEffect(() => () => abortStreamRef.current?.(), []);

  function ensureActiveSession(): Session {
    if (activeSession) return activeSession;
    const fresh = makeNewSession();
    setSessions((prev) => [fresh, ...prev]);
    setActiveId(fresh.id);
    return fresh;
  }

  const sendPrompt = useCallback(
    async (text: string) => {
      const prompt = text.trim();
      if (!prompt || pending) return;

      let session = activeSession;
      if (!session) {
        session = makeNewSession();
        setSessions((prev) => [session!, ...prev]);
        setActiveId(session.id);
      }

      const userMsg: Message = {
        id: makeId(),
        role: "user",
        text: prompt,
        createdAt: new Date().toISOString(),
      };

      const nowIso = new Date().toISOString();
      const isFirst = session.messages.length === 0;
      setSessions((prev) =>
        prev.map((s) =>
          s.id === session!.id
            ? {
                ...s,
                title: isFirst ? titleFromPrompt(prompt) : s.title,
                messages: [...s.messages, userMsg],
                updatedAt: nowIso,
              }
            : s,
        ),
      );
      setDraft("");
      setShowSessionsOnMobile(false);
      track("learner_assistant_message_sent" as never, {
        length: prompt.length,
      });
      setPending(true);

      // Insert an empty assistant message we append streamed tokens to.
      const assistantId = makeId();
      setSessions((prev) =>
        prev.map((s) =>
          s.id === session!.id
            ? {
                ...s,
                messages: [
                  ...s.messages,
                  {
                    id: assistantId,
                    role: "assistant",
                    text: "",
                    createdAt: new Date().toISOString(),
                  } as Message,
                ],
              }
            : s,
        ),
      );

      const patchAssistant = (patch: (m: Message) => Message) =>
        setSessions((prev) =>
          prev.map((s) =>
            s.id === session!.id
              ? {
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === assistantId ? patch(m) : m,
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : s,
          ),
        );

      abortStreamRef.current?.(); // cancel any prior in-flight stream
      abortStreamRef.current = streamChat(
        { conversationId: session!.conversationId, message: prompt },
        {
          onChunk: (token) =>
            patchAssistant((m) => ({ ...m, text: m.text + token })),
          onSources: ({ regulatory, files }) =>
            patchAssistant((m) => ({
              ...m,
              regulatorySources: regulatory,
              sources: files,
            })),
          onDone: (conversationId, title) => {
            setSessions((prev) =>
              prev.map((s) =>
                s.id === session!.id
                  ? {
                      ...s,
                      conversationId,
                      title: s.title || title || "",
                      loaded: true,
                      updatedAt: new Date().toISOString(),
                    }
                  : s,
              ),
            );
            setPending(false);
            textareaRef.current?.focus();
          },
          onError: () => {
            patchAssistant((m) => ({
              ...m,
              text:
                m.text ||
                "Kechirasiz, javobni olishda xatolik yuz berdi. Qayta urinib ko'ring.",
            }));
            setPending(false);
          },
        },
      );
    },
    [activeSession, pending],
  );

  function startNewChat() {
    const fresh = makeNewSession();
    setSessions((prev) => [fresh, ...prev]);
    setActiveId(fresh.id);
    setDraft("");
    setShowSessionsOnMobile(false);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }

  function deleteSession(id: string) {
    const session = sessions.find((s) => s.id === id);
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (activeId === id) setActiveId(next[0]?.id ?? null);
      return next;
    });
    if (session?.conversationId) {
      deleteConversation(session.conversationId).catch(() => {
        /* best-effort; row already removed from UI */
      });
    }
  }

  function setFeedback(messageId: string, value: "up" | "down") {
    if (!activeSession) return;
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id
          ? {
              ...s,
              messages: s.messages.map((m) =>
                m.id === messageId
                  ? { ...m, feedback: m.feedback === value ? undefined : value }
                  : m,
              ),
            }
          : s,
      ),
    );
    track("learner_assistant_feedback" as never, { value });
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrompt(draft);
    }
  }

  const msgs = activeSession?.messages ?? [];
  const lastMsg = msgs[msgs.length - 1];
  const showTyping =
    pending && !(lastMsg?.role === "assistant" && lastMsg.text.length > 0);

  return (
    <div className="-my-xl flex h-[calc(100vh-64px)] bg-canvas">
      {/* Sessions panel — desktop */}
      <aside className="hidden md:flex w-[280px] shrink-0 flex-col border-r border-hairline-soft">
        <SessionsPanel
          sessions={sessions}
          activeId={activeId}
          onPick={(id) => setActiveId(id)}
          onNew={startNewChat}
          onDelete={deleteSession}
          copy={copy}
        />
      </aside>

      {/* Sessions panel — mobile drawer */}
      {showSessionsOnMobile && (
        <div className="md:hidden fixed inset-0 z-30 flex">
          <div
            className="absolute inset-0 bg-primary/40"
            onClick={() => setShowSessionsOnMobile(false)}
            aria-hidden
          />
          <div className="relative z-10 w-[280px] bg-canvas border-r border-hairline-soft">
            <SessionsPanel
              sessions={sessions}
              activeId={activeId}
              onPick={(id) => {
                setActiveId(id);
                setShowSessionsOnMobile(false);
              }}
              onNew={startNewChat}
              onDelete={deleteSession}
              copy={copy}
            />
          </div>
        </div>
      )}

      {/* Main chat column */}
      <section className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 px-md md:px-lg flex items-center gap-md border-b border-hairline-soft shrink-0">
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md text-ink hover:bg-surface"
            aria-label={copy.openSessions}
            onClick={() => setShowSessionsOnMobile(true)}
          >
            <Icon.Chat />
          </button>
          <h1 className="text-body-md-medium text-ink truncate flex-1">
            {activeSession && activeSession.title
              ? activeSession.title
              : copy.title}
          </h1>
          <Button variant="secondary" onClick={startNewChat}>
            <AILogo size={14} on="auto" />
            <span className="hidden sm:inline">{copy.newChat}</span>
          </Button>
        </header>

        {/* Messages */}
        <div
          ref={messagesRef}
          className="flex-1 overflow-y-auto px-md md:px-section"
        >
          <div className="max-w-[760px] mx-auto py-xl">
            {activeSession && activeSession.messages.length > 0 ? (
              <ul className="flex flex-col gap-lg">
                {activeSession.messages
                  // Skip the empty assistant placeholder while it streams — the
                  // TypingBubble stands in until the first token arrives, so we
                  // don't show an empty card next to the loading indicator.
                  .filter(
                    (m) => !(m.role === "assistant" && m.text.length === 0),
                  )
                  .map((m) => (
                    <li key={m.id}>
                      <MessageBubble
                        message={m}
                        onFeedback={(v) => setFeedback(m.id, v)}
                        onFollowUp={(p) => sendPrompt(p)}
                        copy={copy}
                      />
                    </li>
                  ))}
                {showTyping && (
                  <li>
                    <TypingBubble label={copy.typing} />
                  </li>
                )}
              </ul>
            ) : (
              <Welcome
                copy={copy}
                onPick={(p) => sendPrompt(p)}
                ensureSession={ensureActiveSession}
              />
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-hairline-soft px-md md:px-section py-md bg-canvas">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendPrompt(draft);
            }}
            className="max-w-[760px] mx-auto flex flex-col gap-xs"
          >
            <div
              className={cn(
                "rounded-2xl border border-hairline-strong bg-canvas",
                "focus-within:border-brand-blue focus-within:border-2",
                "transition-colors p-xs flex items-end gap-xs",
              )}
            >
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder={copy.placeholder}
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  // Auto-grow.
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
                }}
                onKeyDown={onKey}
                className={cn(
                  "flex-1 resize-none bg-transparent text-body-md text-ink",
                  "px-sm py-xs outline-none placeholder:text-muted",
                  "min-h-[36px] max-h-[200px]",
                )}
                disabled={pending}
              />
              <button
                type="submit"
                disabled={pending || draft.trim().length === 0}
                className={cn(
                  "shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full",
                  "bg-primary text-on-primary dark:bg-on-primary dark:text-primary",
                  "hover:opacity-90 transition-opacity",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                )}
                aria-label={copy.send}
                title={copy.send}
              >
                {pending ? <Spinner /> : <SendIcon />}
              </button>
            </div>
            <p className="text-caption text-stone px-sm">{copy.privacyNote}</p>
          </form>
        </div>
      </section>
    </div>
  );
}

// ----------------------------- Sessions panel ---------------------------

type AssistantCopy = ReturnType<typeof useT>["app"]["assistant"];

function SessionsPanel({
  sessions,
  activeId,
  onPick,
  onNew,
  onDelete,
  copy,
}: {
  sessions: ReadonlyArray<Session>;
  activeId: string | null;
  onPick: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  copy: AssistantCopy;
}) {
  const grouped = useMemo(() => {
    const buckets: Record<SessionGroup, Session[]> = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: [],
    };
    for (const s of sessions) buckets[groupOf(s)].push(s);
    return buckets;
  }, [sessions]);

  const labelOf: Record<SessionGroup, string> = {
    today: copy.groupToday,
    yesterday: copy.groupYesterday,
    thisWeek: copy.groupThisWeek,
    older: copy.groupOlder,
  };

  return (
    <>
      <div className="p-md border-b border-hairline-soft">
        <Button variant="primary" className="w-full" onClick={onNew}>
          <AILogo size={14} on="primary" />
          <span>{copy.newChat}</span>
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-xs">
        {sessions.length === 0 && (
          <p className="text-caption text-stone p-md">{copy.sessionsEmpty}</p>
        )}
        {GROUP_ORDER.map((g) => {
          const list = grouped[g];
          if (list.length === 0) return null;
          return (
            <div key={g} className="mb-sm">
              <p className="px-sm pt-sm pb-xs text-micro-uppercase uppercase text-stone">
                {labelOf[g]}
              </p>
              <ul className="flex flex-col gap-px">
                {list.map((s) => (
                  <SessionItem
                    key={s.id}
                    session={s}
                    active={s.id === activeId}
                    onPick={() => onPick(s.id)}
                    onDelete={() => onDelete(s.id)}
                    deleteLabel={copy.deleteSession}
                  />
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
}

function SessionItem({
  session,
  active,
  onPick,
  onDelete,
  deleteLabel,
}: {
  session: Session;
  active: boolean;
  onPick: () => void;
  onDelete: () => void;
  deleteLabel: string;
}) {
  return (
    <li className="group relative">
      <button
        type="button"
        onClick={onPick}
        className={cn(
          "w-full text-left px-sm py-xs rounded-md flex items-start gap-xs",
          "text-body-sm-medium",
          active
            ? "bg-surface text-ink"
            : "text-charcoal hover:bg-surface-soft hover:text-ink",
        )}
      >
        <Icon.Chat />
        <span className="flex-1 truncate min-w-0">
          {session.title || "New chat"}
        </span>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className={cn(
          "absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md",
          "inline-flex items-center justify-center text-stone hover:text-coral-dark hover:bg-canvas",
          "opacity-0 group-hover:opacity-100 transition-opacity",
        )}
        aria-label={deleteLabel}
        title={deleteLabel}
      >
        <TrashIcon />
      </button>
    </li>
  );
}

// ----------------------------- Welcome ---------------------------------

function Welcome({
  copy,
  onPick,
  ensureSession,
}: {
  copy: AssistantCopy;
  onPick: (prompt: string) => void;
  ensureSession: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center pt-section">
      <div className="w-14 h-14 mb-md rounded-2xl bg-brand-yellow pastel inline-flex items-center justify-center text-primary">
        <AILogo size={30} on="light" />
      </div>
      <h2 className="text-heading-2 font-display text-ink">
        {copy.welcomeTitle}
      </h2>
      <p className="mt-sm text-body-md text-slate max-w-[520px]">
        {copy.welcomeBody}
      </p>

      <p className="mt-2xl mb-md text-caption-bold uppercase text-stone tracking-wide">
        {copy.samplePromptsLabel}
      </p>
      <ul className="grid gap-xs sm:grid-cols-2 w-full max-w-[640px]">
        {copy.samplePrompts.map((p) => (
          <li key={p}>
            <button
              type="button"
              onClick={() => {
                ensureSession();
                onPick(p);
              }}
              className={cn(
                "w-full text-left rounded-xl border border-hairline-soft bg-canvas",
                "px-md py-sm hover:border-hairline-strong hover:bg-surface-soft transition-colors",
              )}
            >
              <span className="text-body-sm text-ink">{p}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ----------------------------- Messages --------------------------------

function MessageBubble({
  message,
  onFeedback,
  onFollowUp,
  copy,
}: {
  message: Message;
  onFeedback: (v: "up" | "down") => void;
  onFollowUp: (p: string) => void;
  copy: AssistantCopy;
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl bg-primary text-on-primary dark:bg-on-primary dark:text-primary px-md py-sm whitespace-pre-line">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-sm">
      <div
        className={cn(
          "w-8 h-8 rounded-full bg-brand-yellow pastel shrink-0",
          "inline-flex items-center justify-center text-primary",
        )}
        aria-hidden
      >
        <AILogo size={18} on="light" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="rounded-2xl bg-surface px-md py-sm text-body-md text-ink">
          <AssistantAnswer
            text={message.text}
            regulatorySources={message.regulatorySources}
            sources={message.sources}
            sourcesLabel={copy.sourcesLabel}
          />
        </div>

        {message.followUps && message.followUps.length > 0 && (
          <ul className="mt-xs flex flex-wrap gap-xs">
            {message.followUps.map((f) => (
              <li key={f}>
                <button
                  type="button"
                  onClick={() => onFollowUp(f)}
                  className={cn(
                    "inline-flex items-center px-sm py-[3px] rounded-full",
                    "text-caption text-charcoal bg-canvas border border-hairline",
                    "hover:bg-surface-soft transition-colors",
                  )}
                >
                  {f}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-xs flex items-center gap-xs text-stone">
          <button
            type="button"
            onClick={() => onFeedback("up")}
            className={cn(
              "w-7 h-7 inline-flex items-center justify-center rounded-md hover:bg-surface",
              message.feedback === "up" && "text-success-accent",
            )}
            aria-label={copy.thumbsUp}
            title={copy.thumbsUp}
          >
            <ThumbsUpIcon />
          </button>
          <button
            type="button"
            onClick={() => onFeedback("down")}
            className={cn(
              "w-7 h-7 inline-flex items-center justify-center rounded-md hover:bg-surface",
              message.feedback === "down" && "text-coral-dark",
            )}
            aria-label={copy.thumbsDown}
            title={copy.thumbsDown}
          >
            <ThumbsDownIcon />
          </button>
          {message.feedback && (
            <span className="text-caption">{copy.feedbackThanks}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function TypingBubble({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-sm">
      <div
        className={cn(
          "w-8 h-8 rounded-full bg-brand-yellow pastel shrink-0",
          "inline-flex items-center justify-center text-primary",
        )}
        aria-hidden
      >
        <AILogo size={18} on="light" />
      </div>
      <div className="rounded-2xl bg-surface px-md py-sm text-body-sm text-stone inline-flex items-center gap-xs">
        <Dot delay="0ms" />
        <Dot delay="120ms" />
        <Dot delay="240ms" />
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full bg-stone animate-bounce"
      style={{ animationDelay: delay }}
      aria-hidden
    />
  );
}

// ----------------------------- Icons ------------------------------------

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2 8L14 2L9 14L7 9L2 8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className="animate-spin"
      aria-hidden
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.25"
        fill="none"
      />
      <path
        d="M14 8a6 6 0 0 0-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2 4h10M5 4V2.5h4V4M3.5 4l.5 8h6l.5-8M6 6.5v4M8 6.5v4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ThumbsUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M4 7v6h6.5a1 1 0 0 0 1-.8l1-4.5A1 1 0 0 0 11.5 6.5H8L9 3a1.5 1.5 0 0 0-3-.5L4 7H2v6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function ThumbsDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M10 7V1H3.5a1 1 0 0 0-1 .8l-1 4.5A1 1 0 0 0 2.5 7.5H6L5 11a1.5 1.5 0 0 0 3 .5L10 7h2V1"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
