import { AppShell } from "../../components/app/AppShell";
import { Icon } from "../../components/app/icons";
import { AILogo } from "../../components/ui/AILogo";
import type { SidebarSection } from "../../components/app/Sidebar";
import { useT } from "../../i18n";

export function LearnerLayout() {
  const t = useT();
  const learner = t.app.learner;

  // Notifications + Settings live in the header profile menu (AppHeader),
  // not in the sidebar — keeps the sidebar focused on learning surfaces.
  const sections: ReadonlyArray<SidebarSection> = [
    {
      items: [
        { to: "/learner", end: true, label: learner.dashboard, icon: <Icon.Home /> },
        { to: "/learner/plans", label: learner.plans, icon: <Icon.Book /> },
        { to: "/learner/assistant", label: learner.assistant, icon: <AILogo size={16} /> },
        { to: "/learner/progress", label: learner.progress, icon: <Icon.Chart /> },
      ],
    },
    {
      title: learner.practiceTitle,
      // The simulator is served outside the SPA (reverse-proxied), so these go
      // straight there via a full navigation (external) — no SPA round-trip.
      items: [
        { to: "/learner/simulator", external: true, label: learner.playground, icon: <Icon.Play /> },
        { to: "/learner/simulator", external: true, label: learner.dialog, icon: <Icon.Chat /> },
        { to: "/learner/simulator", external: true, label: learner.fraud, icon: <Icon.Shield /> },
      ],
    },
  ];

  return <AppShell sections={sections} />;
}
