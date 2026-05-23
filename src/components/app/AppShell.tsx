import { useState, type ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar, type SidebarSection } from "./Sidebar";
import { AppHeader } from "./AppHeader";
import { CursorDotWave } from "../ui/CursorDotWave";
import { QuickQuestionsWidget } from "../../features/quickQuestions";
import { cn } from "../../lib/cn";

type AppShellProps = {
  sections: ReadonlyArray<SidebarSection>;
  footer?: ReactNode;
};

export function AppShell({ sections, footer }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas text-ink flex isolate">
      {/* Halftone dot field that follows the cursor. `isolate` on the
          wrapper makes this a local stacking context, so the canvas's
          negative z-index keeps it behind every sibling (sidebar, main,
          cards) instead of leaking into the root context. */}
      <CursorDotWave layer="behind" />
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0 sticky top-0 h-screen">
        <Sidebar sections={sections} footer={footer} />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-primary/30"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="relative z-10">
            <Sidebar sections={sections} footer={footer} />
          </div>
        </div>
      )}

      {/* Main column */}
      <div className={cn("flex-1 min-w-0 flex flex-col relative")}>
        <AppHeader onMenuClick={() => setMobileOpen((v) => !v)} />
        <main className="flex-1 px-md md:px-xl py-xl">
          <Outlet />
        </main>
        <QuickQuestionsWidget />
      </div>
    </div>
  );
}
