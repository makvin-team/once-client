import { useCallback, useEffect, useRef, useState } from "react";
import { PageHeader } from "../../components/app/PageHeader";
import { Button } from "../../components/ui/Button";
import { StatusPill } from "../../components/app/StatusPill";
import { cn } from "../../lib/cn";
import {
  type DocumentDto,
  type DocumentStats,
  uploadDocument,
  listDocuments,
  getStats,
} from "../../lib/knowledgeApi";

const ACCEPT = ".pdf,.docx,.txt,.md,.html";

type QueueItem = {
  id: string;
  name: string;
  state: "queued" | "uploading" | "done" | "error";
  error?: string;
};

function statusTone(status: string): "success" | "danger" | "warning" | "neutral" {
  switch (status) {
    case "embedded":
      return "success";
    case "failed":
      return "danger";
    case "pending":
    case "processing":
      return "warning";
    default:
      return "neutral";
  }
}

export function AdminKnowledge() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [docs, setDocs] = useState<DocumentDto[]>([]);
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [d, s] = await Promise.all([listDocuments(), getStats()]);
      setDocs(d);
      setStats(s);
    } catch {
      /* leave current data; empty state covers first load */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Poll while any document is still being embedded.
  useEffect(() => {
    const settling = docs.some(
      (d) => d.embeddingStatus === "pending" || d.embeddingStatus === "processing",
    );
    if (!settling) return;
    const timer = window.setInterval(refresh, 4000);
    return () => window.clearInterval(timer);
  }, [docs, refresh]);

  const enqueueAndUpload = useCallback(
    async (files: File[]) => {
      const items: QueueItem[] = files.map((f) => ({
        id: `${f.name}_${Math.random().toString(36).slice(2, 8)}`,
        name: f.name,
        state: "queued",
      }));
      setQueue((prev) => [...items, ...prev]);

      for (let i = 0; i < files.length; i++) {
        const item = items[i];
        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, state: "uploading" } : q)),
        );
        try {
          await uploadDocument(files[i]);
          setQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, state: "done" } : q)),
          );
        } catch (e) {
          const msg = e instanceof Error ? e.message : "error";
          setQueue((prev) =>
            prev.map((q) =>
              q.id === item.id ? { ...q, state: "error", error: msg } : q,
            ),
          );
        }
      }
      refresh();
    },
    [refresh],
  );

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length) enqueueAndUpload(files);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) enqueueAndUpload(files);
  }

  return (
    <div className="space-y-lg">
      <PageHeader
        eyebrow="Knowledge base"
        title="Bank hujjatlari va knowledge base"
        description="Hujjat yuklang — ai-backend uni knowledge_base kolleksiyasiga indekslaydi."
        actions={
          <Button variant="secondary" onClick={refresh} disabled={loading}>
            Refresh
          </Button>
        }
      />

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "rounded-2xl border-2 border-dashed p-xl text-center transition-colors",
          dragOver
            ? "border-brand-blue bg-surface-soft"
            : "border-hairline-strong bg-canvas",
        )}
      >
        <p className="text-body-md text-ink">Drag &amp; drop documents here</p>
        <p className="text-caption text-stone mt-xs">PDF, DOCX, TXT, MD, HTML</p>
        <div className="mt-md">
          <Button variant="secondary" onClick={() => inputRef.current?.click()}>
            Choose files
          </Button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPT}
            className="hidden"
            onChange={onPick}
          />
        </div>
      </div>

      {/* Upload queue */}
      {queue.length > 0 && (
        <ul className="space-y-xs">
          {queue.map((q) => (
            <li key={q.id} className="flex items-center gap-sm text-body-sm">
              <span className="flex-1 truncate text-ink">{q.name}</span>
              {q.state === "queued" && <span className="text-stone">Queued</span>}
              {q.state === "uploading" && (
                <span className="text-stone">Uploading…</span>
              )}
              {q.state === "done" && <StatusPill label="Uploaded" tone="success" />}
              {q.state === "error" && (
                <StatusPill label={q.error ?? "Error"} tone="danger" />
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Stats line */}
      <p className="text-caption text-stone">
        {stats
          ? `${stats.total} documents · ${stats.embedded} embedded · ${
              stats.processing + stats.pending
            } processing · ${stats.failed} failed`
          : "—"}
      </p>

      {/* Documents table */}
      <div className="rounded-xl border border-hairline-soft overflow-hidden">
        <table className="w-full text-body-sm">
          <thead className="bg-surface-soft text-stone">
            <tr>
              <th className="text-left px-md py-sm font-medium">Filename</th>
              <th className="text-left px-md py-sm font-medium">Status</th>
              <th className="text-right px-md py-sm font-medium">Chunks</th>
            </tr>
          </thead>
          <tbody>
            {docs.length === 0 && (
              <tr>
                <td colSpan={3} className="px-md py-lg text-center text-stone">
                  {loading ? "Loading…" : "No documents yet"}
                </td>
              </tr>
            )}
            {docs.map((d) => (
              <tr key={d.id} className="border-t border-hairline-soft">
                <td className="px-md py-sm text-ink truncate max-w-[420px]">
                  {d.filename}
                </td>
                <td className="px-md py-sm">
                  <StatusPill label={d.embeddingStatus} tone={statusTone(d.embeddingStatus)} />
                </td>
                <td className="px-md py-sm text-right text-charcoal">
                  {d.chunksCount ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
