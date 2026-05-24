// Stubs for learner pages whose UI hasn't been built yet. Each page shows a
// PageHeader (so the URL feels intentional) + the standard "coming soon"
// empty state. Replace each export with a full implementation in a follow-up.

import { StubPage } from "../../components/app/StubPage";
import { ProfileSettings } from "../../features/profile";

// LearnerAssistant lives in its own file — see ./Assistant.tsx.

export function LearnerPlayground() {
  return (
    <StubPage
      eyebrow="Mock playground"
      title="Bank workflow mashqi"
      description="Mijozga hisob ochish, karta rasmiylashtirish, ABS workflow va shubhali operatsiya scenariy'lari."
    />
  );
}

export function LearnerDialog() {
  return (
    <StubPage
      eyebrow="Mijoz simulyatori"
      title="AI Client Communication Trainer"
      description="Norozi mijoz, VIP murojaat, fraud gumoni — virtual mijoz bilan AI baholash."
    />
  );
}

export function LearnerProgress() {
  return (
    <StubPage
      eyebrow="Progress"
      title="Mening progress va sertifikatlarim"
      description="Modul progress, quiz natijalari, simulator score, skill gap va sertifikatlar."
    />
  );
}

export function LearnerNotifications() {
  return (
    <StubPage
      eyebrow="Bildirishnomalar"
      title="Bildirishnomalar markazi"
      description="Yangi task, deadline, assessment natijasi, admin feedback va certificate'lar."
    />
  );
}

export function LearnerSettings() {
  return <ProfileSettings />;
}
