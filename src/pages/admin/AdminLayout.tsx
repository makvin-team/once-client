import { AppShell } from "../../components/app/AppShell";
import { Icon } from "../../components/app/icons";
import { AILogo } from "../../components/ui/AILogo";
import type { SidebarSection } from "../../components/app/Sidebar";
import { useT } from "../../i18n";

export function AdminLayout() {
  const t = useT();
  const a = t.app.admin;

  const sections: ReadonlyArray<SidebarSection> = [
    {
      items: [
        { to: "/admin", end: true, label: a.dashboard, icon: <Icon.Home /> },
      ],
    },
    {
      title: a.peopleTitle,
      items: [
        { to: "/admin/users", label: a.users, icon: <Icon.Users />, permission: "user.read" },
        { to: "/admin/org", label: a.org, icon: <Icon.Building />, permission: "org.manage" },
        { to: "/admin/assignments", label: a.assignments, icon: <Icon.Clipboard />, permission: "assignment.create" },
      ],
    },
    {
      title: a.contentTitle,
      items: [
        { to: "/admin/knowledge", label: a.knowledge, icon: <Icon.Doc />, permission: "kb.read" },
        { to: "/admin/assistant", label: a.aiAssistant, icon: <AILogo size={16} />, permission: "ai.review_logs" },
        { to: "/admin/plans", label: a.plans, icon: <Icon.Book />, permission: "plan.create" },
        { to: "/admin/modules", label: a.modules, icon: <Icon.Book />, permission: "module.manage" },
        { to: "/admin/quizzes", label: a.quizzes, icon: <Icon.Quiz />, permission: "quiz.manage" },
      ],
    },
    {
      title: a.simulatorsTitle,
      items: [
        { to: "/admin/scenarios/mock", label: a.mockScenarios, icon: <Icon.Play />, permission: "scenario.mock.manage" },
        { to: "/admin/scenarios/fraud", label: a.fraudScenarios, icon: <Icon.Shield />, permission: "scenario.fraud.manage" },
      ],
    },
    {
      title: a.insightsTitle,
      items: [
        { to: "/admin/progress", label: a.progress, icon: <Icon.Chart />, permission: "progress.read_all" },
        { to: "/admin/skills", label: a.skills, icon: <Icon.Bolt />, permission: "skills.read_all" },
        { to: "/admin/reports", label: a.reports, icon: <Icon.Trophy />, permission: "report.export" },
      ],
    },
    {
      title: a.systemTitle,
      items: [
        { to: "/admin/integration", label: a.integration, icon: <Icon.Plug />, permission: "integration.manage" },
        { to: "/admin/audit", label: a.audit, icon: <Icon.Audit />, permission: "audit.read" },
      ],
    },
  ];

  return <AppShell sections={sections} />;
}
