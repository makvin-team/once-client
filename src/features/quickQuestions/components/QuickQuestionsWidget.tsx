import { useEffect, useRef, useState } from "react";
import { cn } from "../../../lib/cn";
import { Icon } from "../../../components/app/icons";
import { AILogo } from "../../../components/ui/AILogo";
import { mockAIRespond } from "../../../lib/mockAI";

type QuickQuestionsWidgetProps = {
  className?: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

function makeId() {
  return Math.random().toString(36).slice(2);
}

export function QuickQuestionsWidget({ className }: QuickQuestionsWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
    inputRef.current?.focus();
  }, [isOpen, messages.length, pending]);

  function sendMessage() {
    const text = draft.trim();
    if (!text || pending) return;

    const userMsg: ChatMessage = { id: makeId(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setDraft("");
    setPending(true);

    const delay = 600 + Math.random() * 700;
    window.setTimeout(() => {
      const reply = mockAIRespond(text);
      const assistantMsg: ChatMessage = {
        id: makeId(),
        role: "assistant",
        text: reply.text,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setPending(false);
    }, delay);
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex flex-col items-end",
        className,
      )}
    >
      {/* Panel */}
      <div
        className={cn(
          "mb-3 origin-bottom-right",
          "transition-all duration-200 ease-out",
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none",
        )}
        aria-hidden={!isOpen}
      >
        <div
          role="dialog"
          aria-label="Quick Questions"
          className={cn(
            "w-[380px] h-[520px] flex flex-col",
            "bg-canvas border border-hairline-soft rounded-2xl",
            "shadow-[0_12px_32px_-4px_rgba(5,0,56,0.18)]",
            "overflow-hidden",
          )}
        >
          {/* Header */}
          <div
            className={cn(
              "flex items-center justify-between px-md py-sm",
              "border-b border-hairline-soft bg-surface-soft",
            )}
          >
            <div className="flex items-center gap-sm">
              <div
                className={cn(
                  "w-7 h-7 rounded-full bg-brand-yellow pastel shrink-0",
                  "inline-flex items-center justify-center text-primary",
                )}
                aria-hidden
              >
                <AILogo size={14} on="light" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-body-sm-medium text-ink leading-tight">
                  Quick Questions
                </h3>
                <span className="text-xs text-stone leading-tight">
                  Ask anything — get instant help
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className={cn(
                "h-8 w-8 inline-flex items-center justify-center rounded-full",
                "text-charcoal hover:bg-surface",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue",
                "transition-colors",
              )}
            >
              <Icon.Close />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto px-md py-md min-h-0"
          >
            {messages.length === 0 ? (
              <EmptyState onPick={(p) => setDraft(p)} />
            ) : (
              <ul className="flex flex-col gap-sm">
                {messages.map((m) => (
                  <li key={m.id}>
                    <Bubble message={m} />
                  </li>
                ))}
                {pending && (
                  <li>
                    <TypingBubble />
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-hairline-soft px-md py-sm bg-canvas">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className={cn(
                "rounded-xl border border-hairline-strong bg-canvas",
                "focus-within:border-brand-blue focus-within:border-2",
                "transition-colors p-xs flex items-end gap-xs",
              )}
            >
              <textarea
                ref={inputRef}
                rows={1}
                placeholder="Type your question..."
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
                }}
                onKeyDown={onKey}
                disabled={pending}
                className={cn(
                  "flex-1 resize-none bg-transparent text-body-sm text-ink",
                  "px-sm py-xs outline-none placeholder:text-muted",
                  "min-h-[32px] max-h-[120px]",
                )}
              />
              <button
                type="submit"
                disabled={pending || draft.trim().length === 0}
                aria-label="Send"
                className={cn(
                  "shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full",
                  "bg-primary text-on-primary dark:bg-on-primary dark:text-primary",
                  "hover:opacity-90 transition-opacity",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                )}
              >
                {pending ? <Spinner /> : <SendIcon />}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close quick questions" : "Open quick questions"}
        aria-expanded={isOpen}
        className={cn(
          "relative h-14 w-14 rounded-full",
          "inline-flex items-center justify-center",
          "shadow-[0_8px_24px_-4px_rgba(5,0,56,0.22)]",
          "transition-all duration-150 ease-out",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2",
          isOpen
            ? "bg-primary text-on-primary dark:bg-on-primary dark:text-primary"
            : "bg-brand-yellow text-primary hover:opacity-90",
        )}
      >
        {isOpen ? (
          <span className="scale-125">
            <Icon.Close />
          </span>
        ) : (
          <AILogo size={22} on="light" />
        )}
      </button>
    </div>
  );
}

// ----------------------------- Empty state -----------------------------

const SUGGESTIONS = [
  "AML red flag belgilari",
  "KYC hujjat tekshiruvi",
  "ABS transfer workflow",
  "Phishing belgilari",
];

type EmptyStateProps = {
  onPick: (prompt: string) => void;
};

function EmptyState({ onPick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center pt-md">
      <div
        className={cn(
          "w-10 h-10 rounded-2xl bg-brand-yellow pastel mb-sm",
          "inline-flex items-center justify-center text-primary",
        )}
        aria-hidden
      >
        <AILogo size={18} on="light" />
      </div>
      <h4 className="text-body-md-medium text-ink">How can I help?</h4>
      <p className="text-xs text-stone mt-1 max-w-[280px]">
        Ask a quick question and get an instant answer from the assistant.
      </p>

      <ul className="mt-md flex flex-col gap-xs w-full">
        {SUGGESTIONS.map((p) => (
          <li key={p}>
            <button
              type="button"
              onClick={() => onPick(p)}
              className={cn(
                "w-full text-left rounded-lg border border-hairline-soft bg-canvas",
                "px-sm py-xs hover:border-hairline-strong hover:bg-surface-soft",
                "text-body-sm text-ink transition-colors",
              )}
            >
              {p}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ----------------------------- Bubble ----------------------------------

type BubbleProps = {
  message: ChatMessage;
};

function Bubble({ message }: BubbleProps) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div
          className={cn(
            "max-w-[85%] rounded-2xl px-md py-sm",
            "bg-primary text-on-primary dark:bg-on-primary dark:text-primary",
            "text-body-sm whitespace-pre-line",
          )}
        >
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-xs">
      <div
        className={cn(
          "w-6 h-6 rounded-full bg-brand-yellow pastel shrink-0 mt-xs",
          "inline-flex items-center justify-center text-primary",
        )}
        aria-hidden
      >
        <AILogo size={12} on="light" />
      </div>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-md py-sm",
          "bg-surface text-ink text-body-sm whitespace-pre-line",
        )}
      >
        {message.text}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-center gap-xs">
      <div
        className={cn(
          "w-6 h-6 rounded-full bg-brand-yellow pastel shrink-0",
          "inline-flex items-center justify-center text-primary",
        )}
        aria-hidden
      >
        <AILogo size={12} on="light" />
      </div>
      <div className="rounded-2xl bg-surface px-md py-sm inline-flex items-center gap-xs">
        <Dot delay="0ms" />
        <Dot delay="120ms" />
        <Dot delay="240ms" />
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

// ----------------------------- Icons -----------------------------------

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
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
      width="14"
      height="14"
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
