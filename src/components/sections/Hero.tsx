import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { useT } from "../../i18n";
import { onAnchorClick } from "../../lib/scroll";
import { track } from "../../lib/analytics";

const badgeVariants = {
  yellow: "tag-yellow",
  coral: "tag-coral",
  teal: "tag-teal",
  rose: "tag-purple",
} as const;

export function Hero() {
  const t = useT();
  const hero = t.hero;

  const remainingTitle = hero.title.replace(hero.titleHighlight, "").trim();

  return (
    // h-screen minus PromoBanner (~48px) + TopNav (64px) = 112px chrome above
    <section className="relative isolate h-[calc(100vh-64px)] md:h-[calc(100vh-112px)] min-h-[560px] overflow-hidden bg-canvas">
      <img
        aria-hidden
        src="/grid.png"
        alt=""
        className="hidden md:block absolute inset-0 w-full h-full object-cover object-top -z-10 pointer-events-none select-none opacity-[0.05]"
      />
      <div className="mx-auto max-w-container px-2xl text-center flex flex-col items-center justify-center h-full pb-0 md:pb-[300px]">
        <Badge variant="tag-purple" className="mb-md">
          {hero.eyebrow}
        </Badge>
        <h1 className="text-heading-1 md:text-display-lg text-ink font-display max-w-[900px] mx-auto">
          <span className="text-brand-yellow-deep">{hero.titleHighlight}</span>{" "}
          {remainingTitle}
        </h1>
        <p className="mt-md mx-auto max-w-[720px] text-subtitle text-slate">
          {hero.subtitle}
        </p>

        <div className="mt-lg flex items-center justify-center gap-sm flex-wrap">
          <Button
            variant="primary"
            size="lg"
            onClick={(e) => {
              track("request_demo_clicked", { location: "hero" });
              onAnchorClick(e, hero.primaryCtaHref);
            }}
          >
            {hero.primaryCta}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={(e) => {
              track("view_features_clicked", { location: "hero" });
              onAnchorClick(e, hero.secondaryCtaHref);
            }}
          >
            {hero.secondaryCta}
          </Button>
        </div>

        <ul className="mt-md flex items-center justify-center gap-xs flex-wrap">
          {hero.badges.map((b) => (
            <li key={b.label}>
              <Badge variant={badgeVariants[b.tone]}>{b.label}</Badge>
            </li>
          ))}
        </ul>
      </div>

      {/* Whiteboard mockup — board height ~480px, 30% (~144px) cropped below the hero edge */}
      <div className="hidden md:block absolute inset-x-0 bottom-[-144px] px-2xl">
        <WhiteboardMockup />
      </div>
    </section>
  );
}

// Initial scattered layout for the whiteboard sticky notes. Coordinates are
// pixels relative to the whiteboard's padded interior (1016×440 approx); on
// narrower viewports the container clamps notes back inside via clampToBox.
const NOTE_W = 148;
const NOTE_H = 120;

const initialLayout: ReadonlyArray<{ x: number; y: number; rotate: number }> = [
  { x: 40, y: 32, rotate: -4 },
  { x: 224, y: 64, rotate: 3 },
  { x: 720, y: 48, rotate: -2 },
  { x: 128, y: 176, rotate: 2 },
  { x: 320, y: 208, rotate: -3 },
  { x: 820, y: 272, rotate: 4 },
  { x: 80, y: 264, rotate: -1 },
  { x: 432, y: 296, rotate: 1 },
  { x: 560, y: 16, rotate: -3 },
  { x: 660, y: 176, rotate: 2 },
  { x: 240, y: 320, rotate: -2 },
  { x: 540, y: 96, rotate: 4 },
];

type StickyTone = "yellow" | "coral" | "teal" | "rose" | "orange";

type NoteState = {
  tone: StickyTone;
  lines: string[];
  x: number;
  y: number;
  rotate: number;
};

function WhiteboardMockup() {
  const t = useT();
  const { mockup } = t.hero;

  const [notes, setNotes] = useState<NoteState[]>(() =>
    mockup.stickyNotes.map((note, i) => {
      const pos = initialLayout[i % initialLayout.length];
      return {
        tone: note.tone,
        lines: [...note.lines],
        x: pos.x,
        y: pos.y,
        rotate: pos.rotate,
      };
    }),
  );
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  // Tracks the in-flight drag without rerendering on every pixel of motion.
  const dragRef = useRef<{
    idx: number;
    pointerStartX: number;
    pointerStartY: number;
    noteStartX: number;
    noteStartY: number;
  } | null>(null);

  function clampToBox(x: number, y: number) {
    const el = boardRef.current;
    if (!el) return { x, y };
    const maxX = Math.max(0, el.clientWidth - NOTE_W);
    const maxY = Math.max(0, el.clientHeight - NOTE_H);
    return {
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY)),
    };
  }

  function onNotePointerDown(idx: number, e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    e.preventDefault();
    dragRef.current = {
      idx,
      pointerStartX: e.clientX,
      pointerStartY: e.clientY,
      noteStartX: notes[idx].x,
      noteStartY: notes[idx].y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggingIdx(idx);
  }

  function onNotePointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = dragRef.current;
    if (!d) return;
    const nx = d.noteStartX + (e.clientX - d.pointerStartX);
    const ny = d.noteStartY + (e.clientY - d.pointerStartY);
    const clamped = clampToBox(nx, ny);
    setNotes((prev) => {
      const next = prev.slice();
      next[d.idx] = { ...next[d.idx], x: clamped.x, y: clamped.y };
      return next;
    });
  }

  function onNotePointerUp(e: PointerEvent<HTMLDivElement>) {
    dragRef.current = null;
    setDraggingIdx(null);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // pointer was already released
    }
  }

  return (
    <div className="relative mx-auto max-w-[1080px] rounded-xl border border-hairline-soft bg-canvas shadow-elev-3 overflow-hidden text-left">
      <div className="flex items-center gap-xs h-9 px-md bg-surface border-b border-hairline-soft">
        <span className="w-3 h-3 rounded-full bg-brand-coral" aria-hidden />
        <span className="w-3 h-3 rounded-full bg-brand-yellow" aria-hidden />
        <span className="w-3 h-3 rounded-full bg-success-accent" aria-hidden />
        <span className="ml-md text-caption text-stone">{mockup.title}</span>
      </div>
      <div
        ref={boardRef}
        className="relative h-[440px] p-2xl bg-surface-soft overflow-hidden select-none"
      >
        {notes.map((note, i) => (
          <StickyNote
            key={i}
            tone={note.tone}
            lines={note.lines}
            dragging={draggingIdx === i}
            style={{
              left: note.x,
              top: note.y,
              transform: `rotate(${note.rotate}deg)`,
            }}
            onPointerDown={(e) => onNotePointerDown(i, e)}
            onPointerMove={onNotePointerMove}
            onPointerUp={onNotePointerUp}
            onPointerCancel={onNotePointerUp}
          />
        ))}
      </div>
    </div>
  );
}

const stickyToneClass: Record<StickyTone, string> = {
  yellow: "bg-brand-yellow",
  coral: "bg-coral-light",
  teal: "bg-teal-light",
  rose: "bg-rose-light",
  orange: "bg-brand-orange-light",
};

function StickyNote({
  tone,
  lines,
  dragging,
  style,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}: {
  tone: StickyTone;
  lines: string[];
  dragging: boolean;
  style: CSSProperties;
  onPointerDown: (e: PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: PointerEvent<HTMLDivElement>) => void;
  onPointerCancel: (e: PointerEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      role="button"
      tabIndex={-1}
      aria-grabbed={dragging}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      style={{
        ...style,
        // touchAction:none stops the page from scrolling while dragging on
        // touch devices. zIndex elevates the active note above its peers.
        touchAction: "none",
        zIndex: dragging ? 50 : 1,
        cursor: dragging ? "grabbing" : "grab",
        boxShadow: dragging
          ? "0 18px 36px -8px rgba(5, 0, 56, 0.22)"
          : undefined,
        transition: dragging ? "none" : "box-shadow 150ms ease",
      }}
      className={
        "absolute w-[148px] h-[120px] p-md text-left text-body-sm-medium text-primary shadow-elev-2 rounded-sm pastel " +
        stickyToneClass[tone]
      }
    >
      {lines.map((l, i) => (
        <div key={i} className={i === 0 ? "text-heading-5 mb-1" : ""}>
          {l}
        </div>
      ))}
    </div>
  );
}
