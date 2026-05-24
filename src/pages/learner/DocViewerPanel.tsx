// Right slide-over that opens a cited document. Two modes:
//   - regulatory: fetch the act's HTML/PDF body and (for HTML) scroll the
//     iframe to the exact cited paragraph anchor; offer a language switch.
//   - file: open an uploaded document, jumping a PDF to the cited page.
//
// Ported from the ai-frontend chat viewers, restyled with once-client tokens
// and built on the same `fixed inset-0` slide-over pattern the assistant's
// mobile sessions drawer uses (no dialog library needed).
//
// The parent remounts this per opened citation (via `key`), so initial fetch
// state lives in `useState` initializers and the fetch effects only ever
// setState from async callbacks — no synchronous resets in an effect body.

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "../../components/app/icons";
import {
  fetchRegulatoryContent,
  fetchRegulatoryDocument,
  fetchRegulatorySiblings,
  fetchFileContent,
  type RegulatoryDocumentMeta,
  type RegulatorySibling,
} from "../../lib/regulatoryApi";

export type ViewerTarget =
  | { kind: "regulatory"; documentId: string; anchorId: string | null }
  | { kind: "file"; filename: string; page: number };

const shortLang = (lang?: string | null): string => {
  if (!lang) return "";
  if (lang === "cyrl") return "UZ-Cyrl";
  return lang.toUpperCase();
};

const isPreviewable = (ct?: string | null): boolean => ct === "pdf" || ct === "html";

export function DocViewerPanel({
  target,
  onClose,
}: {
  target: ViewerTarget;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState(false);

  // Regulatory-only state.
  const [meta, setMeta] = useState<RegulatoryDocumentMeta | null>(null);
  const [siblings, setSiblings] = useState<RegulatorySibling[]>([]);
  // The doc actually shown — starts at the cited one, changes on language switch.
  const [activeDocId, setActiveDocId] = useState<string | null>(
    target.kind === "regulatory" ? target.documentId : null,
  );
  const [anchorId, setAnchorId] = useState<string | null>(
    target.kind === "regulatory" ? target.anchorId : null,
  );

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // File mode: fetch the body and detect PDF for the #page deep link.
  useEffect(() => {
    if (target.kind !== "file") return;
    let cancelled = false;
    let createdUrl: string | null = null;
    fetchFileContent(target.filename)
      .then(({ url, mime }) => {
        if (cancelled) return;
        const pdf =
          mime.toLowerCase().includes("application/pdf") ||
          target.filename.toLowerCase().endsWith(".pdf");
        createdUrl = url;
        const withPage = pdf && target.page > 0 ? `${url}#page=${target.page}` : url;
        setIsPdf(pdf);
        setBlobUrl(withPage);
      })
      .catch(() => !cancelled && setError("load_failed"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [target]);

  // Regulatory mode: fetch metadata + siblings + the (previewable) body.
  // Re-runs when the language switch changes activeDocId.
  useEffect(() => {
    if (target.kind !== "regulatory" || !activeDocId) return;
    const docId = activeDocId;
    let cancelled = false;
    let createdUrl: string | null = null;

    (async () => {
      try {
        const docMeta = await fetchRegulatoryDocument(docId);
        if (cancelled) return;
        setMeta(docMeta);
        // Siblings are best-effort — failure shouldn't block the preview.
        fetchRegulatorySiblings(docId)
          .then((r) => !cancelled && setSiblings(r.items ?? []))
          .catch(() => undefined);

        if (!isPreviewable(docMeta.content_type)) {
          setLoading(false);
          return;
        }
        const { url, mime } = await fetchRegulatoryContent(docId);
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        createdUrl = url;
        setIsPdf(mime.toLowerCase().includes("application/pdf"));
        setBlobUrl(url);
      } catch {
        if (!cancelled) setError("load_failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [target, activeDocId]);

  // Scroll the iframe to the cited paragraph and briefly highlight it. lex.uz
  // tags meaningful paragraphs with `id="-XXX"` (on a <div> or inner <a>);
  // getElementById finds either. HTML only — PDFs use the #page deep link.
  const scrollToAnchor = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe || !anchorId || isPdf) return;
    const doc = iframe.contentDocument;
    if (!doc) return;
    const el = doc.getElementById(anchorId);
    if (!el) return;
    try {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      el.scrollIntoView();
    }
    const prevOutline = el.style.outline;
    const prevBg = el.style.backgroundColor;
    el.style.transition = "background-color 0.6s ease, outline-color 0.6s ease";
    el.style.outline = "2px solid #4262FF";
    el.style.backgroundColor = "rgba(66, 98, 255, 0.12)";
    setTimeout(() => {
      el.style.outline = prevOutline;
      el.style.backgroundColor = prevBg;
    }, 2200);
  }, [anchorId, isPdf]);

  const handleIframeLoad = useCallback(() => {
    requestAnimationFrame(scrollToAnchor);
  }, [scrollToAnchor]);

  const isRegulatory = target.kind === "regulatory";
  const title = isRegulatory
    ? (meta?.doc_number ?? meta?.source_id ?? "Hujjat")
    : target.filename;
  const subtitle = isRegulatory
    ? (meta?.title ?? "")
    : target.page > 0
      ? `${target.page}-bet`
      : "";

  // PDFs render in the browser's own (already sandboxed) viewer; an extra
  // sandbox on a same-origin blob trips Chrome's "blocked" guard. HTML keeps a
  // script-free sandbox (scripts are stripped by sanitizeIfHtml).
  const iframeSandbox = isPdf
    ? undefined
    : "allow-same-origin allow-popups allow-forms";

  const downloadOnly = isRegulatory && meta && !isPreviewable(meta.content_type);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-primary/40" onClick={onClose} aria-hidden />
      <div className="relative z-10 ml-auto flex h-full w-full max-w-3xl flex-col bg-canvas shadow-elev-4">
        {/* Header */}
        <div className="flex items-start gap-sm border-b border-hairline-soft px-md py-sm">
          <Icon.Doc className="mt-0.5 h-4 w-4 shrink-0 text-stone" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-xs">
              <span className="truncate text-body-sm-medium text-ink">{title}</span>
              {isRegulatory && meta?.language && (
                <span className="shrink-0 rounded-sm bg-surface px-1 text-caption text-stone">
                  {shortLang(meta.language)}
                </span>
              )}
            </div>
            {subtitle && (
              <span className="line-clamp-1 text-caption text-stone">{subtitle}</span>
            )}

            {/* Language switch (regulatory, when siblings exist). */}
            {isRegulatory && siblings.length > 0 && (
              <div className="mt-xs flex items-center gap-xs">
                <span className="text-caption text-stone">Til:</span>
                <select
                  className="rounded-md border border-hairline-soft bg-canvas px-xs py-px text-caption text-ink"
                  value={activeDocId ?? ""}
                  onChange={(e) => {
                    const next = e.target.value;
                    if (next && next !== activeDocId) {
                      // Switching to another language reloads the body; the old
                      // anchor id won't exist in different-language HTML.
                      setAnchorId(null);
                      setLoading(true);
                      setError(null);
                      setBlobUrl(null);
                      setActiveDocId(next);
                    }
                  }}
                >
                  {meta && (
                    <option value={meta.id}>{shortLang(meta.language)} (joriy)</option>
                  )}
                  {siblings.map((s) => (
                    <option key={s.id} value={s.id}>
                      {shortLang(s.language)}
                      {s.doc_number ? ` · ${s.doc_number}` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-md p-1 text-stone hover:bg-surface hover:text-ink"
            aria-label="Yopish"
            title="Yopish"
          >
            <Icon.Close className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 bg-surface-soft">
          {loading && (
            <div className="flex h-full items-center justify-center text-body-sm text-stone">
              Yuklanmoqda…
            </div>
          )}
          {!loading && error && (
            <div className="flex h-full items-center justify-center px-md text-center text-body-sm text-coral-dark">
              Hujjatni yuklab bo‘lmadi.
            </div>
          )}
          {!loading && !error && downloadOnly && (
            <div className="flex h-full flex-col items-center justify-center gap-sm px-md text-center">
              <Icon.Doc className="h-8 w-8 text-stone" />
              <p className="text-body-sm text-charcoal">
                Bu hujjat turini oldindan ko‘rib bo‘lmaydi
                {meta?.content_type ? ` (${meta.content_type.toUpperCase()})` : ""}.
              </p>
            </div>
          )}
          {!loading && !error && !downloadOnly && blobUrl && (
            <iframe
              ref={iframeRef}
              onLoad={handleIframeLoad}
              src={blobUrl}
              title={title}
              className="h-full w-full border-0 bg-white"
              sandbox={iframeSandbox}
            />
          )}
        </div>
      </div>
    </div>
  );
}
