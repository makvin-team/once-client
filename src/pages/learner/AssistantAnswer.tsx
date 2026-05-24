// Renders an assistant answer: markdown body with inline numbered citation
// chips, plus a reference list of the cited sources. Clicking a citation opens
// the document in a slide-over — a regulatory act scrolled to the exact cited
// article, or an uploaded file (PDF jumped to the cited page). Ported logic
// from the ai-frontend chat page, restyled with once-client tokens.

import { Children, useCallback, useMemo, useState, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

import { Icon } from "../../components/app/icons";
import { cn } from "../../lib/cn";
import {
  parseCitations,
  canonicalizeReferenceForMatch,
  regulatorySourceLabel,
  type Citation,
  type RegulatorySource,
} from "../../lib/citationParser";
import { DocViewerPanel, type ViewerTarget } from "./DocViewerPanel";

// Stable key per opened citation so the panel remounts (and refetches) on change.
const viewerKey = (t: ViewerTarget): string =>
  t.kind === "regulatory"
    ? `reg:${t.documentId}:${t.anchorId ?? ""}`
    : `file:${t.filename}:${t.page}`;

interface Props {
  text: string;
  regulatorySources?: ReadonlyArray<RegulatorySource>;
  sources?: ReadonlyArray<string>;
  sourcesLabel: string;
}

const BRACKET_REGEX = /[[【]([^\]】]+?)[\]】]/g;

const shortLang = (lang?: string | null): string => {
  if (!lang) return "";
  if (lang === "cyrl") return "UZ-Cyrl";
  return lang.toUpperCase();
};

const clauseHead = (label?: string | null): string | null =>
  label ? String(label).split(".", 1)[0].trim() : null;

// Resolve a citation to a viewer target, or null when it can't be opened
// (a regulatory source with no document_id, or a file with no filename).
function targetFor(citation: Citation): ViewerTarget | null {
  if (citation.kind === "regulatory") {
    const src = citation.regulatorySource;
    const documentId = src?.document_id ?? null;
    if (!documentId) return null;
    return {
      kind: "regulatory",
      documentId,
      // Prefer the exact paragraph anchor; fall back to the article anchor.
      anchorId: src?.primary_anchor_id ?? src?.clause_anchor_id ?? null,
    };
  }
  if (!citation.filename) return null;
  return { kind: "file", filename: citation.filename, page: citation.page ?? 1 };
}

export function AssistantAnswer({
  text,
  regulatorySources,
  sources,
  sourcesLabel,
}: Props) {
  const [viewer, setViewer] = useState<ViewerTarget | null>(null);

  const parsed = useMemo(
    () =>
      parseCitations(
        text,
        sources as string[] | undefined,
        regulatorySources as RegulatorySource[] | undefined,
      ),
    [text, sources, regulatorySources],
  );

  const openCitation = useCallback((citation: Citation) => {
    const target = targetFor(citation);
    if (target) setViewer(target);
  }, []);

  // Second-pass inline lookup. react-markdown renders the escaped brackets back
  // to literal `[...]` text; we find them again and swap in numbered chips.
  // Uses the SAME canonicalization as the parser so transforms don't break the
  // match (a single citation entry covers every bracket variant of one source).
  const renderTextWithCitations = useCallback(
    (value: string): ReactNode => {
      if (parsed.citations.length === 0) return value;
      const parts: ReactNode[] = [];
      let lastIdx = 0;
      let m: RegExpExecArray | null;
      BRACKET_REGEX.lastIndex = 0;
      while ((m = BRACKET_REGEX.exec(value)) !== null) {
        if (m.index > lastIdx) parts.push(value.slice(lastIdx, m.index));
        const ref = m[1].trim().replace(/^["'`]+|["'`]+$/g, "");
        const refKey = canonicalizeReferenceForMatch(ref);
        let citation = parsed.citations.find(
          (c) => canonicalizeReferenceForMatch(c.reference) === refKey,
        );
        if (!citation) {
          // Apostrophe-tolerant doc_number substring match (regulatory).
          citation = parsed.citations.find((c) => {
            const num = c.regulatorySource?.doc_number;
            if (!num) return false;
            const needle = canonicalizeReferenceForMatch(num);
            if (!needle) return false;
            if (refKey.includes(needle)) return true;
            return refKey.replace(/'/g, "").includes(needle.replace(/'/g, ""));
          });
        }
        if (citation) {
          const c = citation;
          parts.push(
            <CitationChip
              key={`chip-${m.index}`}
              index={c.index}
              reference={c.reference}
              onClick={() => openCitation(c)}
            />,
          );
        } else {
          parts.push(m[0]);
        }
        lastIdx = m.index + m[0].length;
      }
      if (lastIdx < value.length) parts.push(value.slice(lastIdx));
      return parts.length > 0 ? parts : value;
    },
    [parsed, openCitation],
  );

  const components = useMemo<Components>(() => {
    const inject = (children: ReactNode): ReactNode =>
      Children.map(children, (child) =>
        typeof child === "string" ? renderTextWithCitations(child) : child,
      );

    return {
      p: ({ children }) => <p className="mb-3 leading-relaxed">{inject(children)}</p>,
      ul: ({ children }) => (
        <ul className="mb-3 list-disc space-y-1 pl-5">{children}</ul>
      ),
      ol: ({ children }) => (
        <ol className="mb-3 list-decimal space-y-1 pl-5">{children}</ol>
      ),
      li: ({ children }) => <li className="leading-relaxed">{inject(children)}</li>,
      strong: ({ children }) => (
        <strong className="font-semibold text-ink">{inject(children)}</strong>
      ),
      em: ({ children }) => <em>{inject(children)}</em>,
      h1: ({ children }) => (
        <h1 className="mb-2 mt-4 text-heading-5 font-semibold text-ink">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="mb-2 mt-4 text-body-md font-semibold text-ink">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="mb-1 mt-3 text-body-md font-semibold text-ink">{children}</h3>
      ),
      a: ({ children, href }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-blue underline underline-offset-2 hover:opacity-80"
        >
          {children}
        </a>
      ),
      code: ({ children, className }) => {
        const isBlock = /language-/.test(className ?? "");
        if (isBlock) {
          return (
            <code className={cn("font-mono text-[0.85em]", className)}>
              {children}
            </code>
          );
        }
        return (
          <code className="rounded border border-hairline-soft bg-canvas px-1 py-0.5 font-mono text-[0.85em]">
            {children}
          </code>
        );
      },
      pre: ({ children }) => (
        <pre className="my-3 overflow-x-auto rounded-lg border border-hairline-soft bg-canvas p-3 text-body-sm">
          {children}
        </pre>
      ),
      blockquote: ({ children }) => (
        <blockquote className="my-3 border-l-2 border-hairline-strong pl-3 italic text-charcoal">
          {children}
        </blockquote>
      ),
      hr: () => <hr className="my-4 border-hairline-soft" />,
      table: ({ children }) => (
        <div className="my-3 overflow-x-auto">
          <table className="w-full border-collapse text-body-sm">{children}</table>
        </div>
      ),
      th: ({ children }) => (
        <th className="border border-hairline-soft px-2 py-1 text-left font-semibold">
          {inject(children)}
        </th>
      ),
      td: ({ children }) => (
        <td className="border border-hairline-soft px-2 py-1">{inject(children)}</td>
      ),
    };
  }, [renderTextWithCitations]);

  return (
    <>
      <div className="text-body-md text-ink [&>*:last-child]:mb-0">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={components}
        >
          {parsed.markdownSafeText}
        </ReactMarkdown>
      </div>

      {parsed.citations.length > 0 && (
        <CitationReferenceList
          citations={parsed.citations}
          sourcesLabel={sourcesLabel}
          onCitationClick={openCitation}
        />
      )}

      {viewer && (
        <DocViewerPanel
          key={viewerKey(viewer)}
          target={viewer}
          onClose={() => setViewer(null)}
        />
      )}
    </>
  );
}

// ----------------------------- Inline chip ------------------------------

function CitationChip({
  index,
  reference,
  onClick,
}: {
  index: number;
  reference: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "mx-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 align-baseline",
        "bg-surface-yellow text-yellow-dark text-[11px] font-bold hover:opacity-80",
      )}
      title={reference}
    >
      {index}
    </button>
  );
}

// ----------------------------- Reference list ---------------------------

function CitationReferenceList({
  citations,
  sourcesLabel,
  onCitationClick,
}: {
  citations: Citation[];
  sourcesLabel: string;
  onCitationClick: (citation: Citation) => void;
}) {
  return (
    <div className="mt-sm space-y-xs">
      <div className="flex items-center gap-xs text-micro-uppercase uppercase tracking-wide text-stone">
        <Icon.Doc className="h-3.5 w-3.5" />
        {sourcesLabel}
      </div>
      <div className="grid gap-xs sm:grid-cols-2">
        {citations.map((c) =>
          c.kind === "regulatory" ? (
            <RegulatoryEntry
              key={c.index}
              citation={c}
              onClick={() => onCitationClick(c)}
            />
          ) : (
            <FileEntry
              key={c.index}
              citation={c}
              onClick={() => onCitationClick(c)}
            />
          ),
        )}
      </div>
    </div>
  );
}

// Shared layout for a reference row; `canOpen` toggles the interactive styles.
function EntryShell({
  index,
  canOpen,
  onClick,
  title,
  children,
}: {
  index: number;
  canOpen: boolean;
  onClick: () => void;
  title?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={!canOpen}
      onClick={() => canOpen && onClick()}
      title={title || undefined}
      className={cn(
        "flex items-start gap-xs rounded-lg border border-hairline-soft bg-canvas px-sm py-xs text-left",
        canOpen
          ? "cursor-pointer hover:border-brand-blue/40 hover:bg-surface-soft"
          : "cursor-default opacity-90",
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
          "bg-surface-yellow text-yellow-dark text-[11px] font-bold",
        )}
      >
        {index}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">{children}</span>
    </button>
  );
}

function RegulatoryEntry({
  citation,
  onClick,
}: {
  citation: Citation;
  onClick: () => void;
}) {
  const src = citation.regulatorySource!;
  const label = regulatorySourceLabel(src, citation.reference);
  const clause = clauseHead(src.clause_label);
  const lang = shortLang(src.language);
  const canOpen = !!src.document_id;
  const tooltip = [src.title, src.doc_type].filter(Boolean).join(" · ");

  return (
    <EntryShell index={citation.index} canOpen={canOpen} onClick={onClick} title={tooltip}>
      <span className="flex items-center gap-1 text-body-sm-medium text-ink">
        <Icon.Doc className="h-3.5 w-3.5 shrink-0 text-stone" />
        <span className="truncate">{label}</span>
        {clause && <span className="text-caption text-brand-blue">· {clause}</span>}
        {lang && <span className="text-caption text-stone">{lang}</span>}
      </span>
      {src.title && (
        <span className="line-clamp-1 text-caption text-stone">{src.title}</span>
      )}
      {src.status === "R" && (
        <span className="inline-flex w-fit items-center rounded-sm bg-coral-light px-1 py-px text-[10px] font-medium text-coral-dark">
          Bekor qilingan
        </span>
      )}
    </EntryShell>
  );
}

function FileEntry({
  citation,
  onClick,
}: {
  citation: Citation;
  onClick: () => void;
}) {
  return (
    <EntryShell
      index={citation.index}
      canOpen={!!citation.filename}
      onClick={onClick}
      title={citation.reference}
    >
      <span className="flex items-center gap-1 text-body-sm-medium text-ink">
        <Icon.Doc className="h-3.5 w-3.5 shrink-0 text-stone" />
        <span className="truncate">{citation.filename ?? citation.reference}</span>
      </span>
      {citation.page != null && citation.page > 0 && (
        <span className="text-caption text-stone">{citation.page}-bet</span>
      )}
    </EntryShell>
  );
}
