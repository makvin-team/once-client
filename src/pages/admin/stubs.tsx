// Admin stubs: pages wired into the sidebar so reviewers can navigate the
// full structure, with each landing on a "coming soon" empty state. Replace
// each export with a full implementation in a follow-up session.

import { StubPage } from "../../components/app/StubPage";

export function AdminOrg() {
  return (
    <StubPage
      eyebrow="Org structure"
      title="Filial, bo'lim, lavozim va guruhlar"
      description="Bank ichki strukturasini boshqarish. Branch → Department → Position → Group ierarxiyasi."
    />
  );
}

export function AdminKnowledge() {
  return (
    <StubPage
      eyebrow="Knowledge base"
      title="Bank hujjatlari va knowledge base"
      description="PDF, DOCX, TXT, Markdown, HTML yuklash. Indexing status, version, visibility."
    />
  );
}

export function AdminAIAssistant() {
  return (
    <StubPage
      eyebrow="AI assistant"
      title="AI sozlamalari va review"
      description="Knowledge scope, system instruction, forbidden topics, feedback va answer log review."
    />
  );
}

export function AdminPlans() {
  return (
    <StubPage
      eyebrow="O'quv rejalar"
      title="Learning plan builder"
      description="Role-based o'quv reja yaratish, modul/quiz/scenario biriktirish, deadline va publish."
    />
  );
}

export function AdminModules() {
  return (
    <StubPage
      eyebrow="Modullar"
      title="Modul va dars boshqaruvi"
      description="Modul yaratish, lesson kontenti, video link, checklist, file biriktirish."
    />
  );
}

export function AdminQuizzes() {
  return (
    <StubPage
      eyebrow="Quiz"
      title="Quiz va assessment builder"
      description="Single/multiple choice, scenario-based, time limit, pass score, randomize."
    />
  );
}

export function AdminMockScenarios() {
  return (
    <StubPage
      eyebrow="Mock scenarios"
      title="Mock playground scenariy boshqaruvi"
      description="Bank workflow, virtual customer, ABS/CRM, document verification scenariy'lari."
    />
  );
}

export function AdminFraudScenarios() {
  return (
    <StubPage
      eyebrow="Fraud scenarios"
      title="Anti-Fraud scenariy boshqaruvi"
      description="Phishing, suspicious transaction, fake document, deepfake, social engineering, AML/KYC red flag."
    />
  );
}

export function AdminAssignments() {
  return (
    <StubPage
      eyebrow="Assignments"
      title="Biriktirish boshqaruvi"
      description="Individual, group, position, department, branch yoki barchaga biriktirish. Mandatory/optional, due date."
    />
  );
}

export function AdminProgress() {
  return (
    <StubPage
      eyebrow="Progress"
      title="Learner progress monitoring"
      description="Modul status, quiz natijalari, simulator score, fraud score, time spent — to'liq filtrlar bilan."
    />
  );
}

export function AdminSkills() {
  return (
    <StubPage
      eyebrow="Skill analytics"
      title="Skill map va gap analysis"
      description="Role-based skill requirement, learner score, department/branch comparison, recommended training."
    />
  );
}

export function AdminReports() {
  return (
    <StubPage
      eyebrow="Reports"
      title="Hisobotlar va export"
      description="Onboarding, completion, quiz, fraud awareness, skill gap, AI usage, content effectiveness. Excel / PDF / CSV."
    />
  );
}

export function AdminIntegration() {
  return (
    <StubPage
      eyebrow="Integration"
      title="LMS / iSpring integratsiyasi"
      description="Connection status, learner result sync, score sync, failed log, retry, manual sync."
    />
  );
}

export function AdminNotifications() {
  return (
    <StubPage
      eyebrow="Notifications"
      title="Bildirishnoma yuborish"
      description="Yangi modul, deadline, assessment, admin announcement — guruh/individual yuborish."
    />
  );
}

export function AdminAudit() {
  return (
    <StubPage
      eyebrow="Audit"
      title="Audit logs"
      description="Login, user/role/document/plan/assignment action'lari. Actor, target, IP, timestamp."
    />
  );
}

export function AdminSettings() {
  return (
    <StubPage
      eyebrow="Settings"
      title="Tizim sozlamalari"
      description="Til, session timeout, password policy, AI policy, file types, data retention."
    />
  );
}
