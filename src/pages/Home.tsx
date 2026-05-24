import { useEffect } from "react";
import { PromoBanner } from "../components/sections/PromoBanner";
import { TopNav } from "../components/sections/TopNav";
import { Hero } from "../components/sections/Hero";
import { Problem } from "../components/sections/Problem";
import { Solution } from "../components/sections/Solution";
import { Features } from "../components/sections/Features";
import { BusinessValue } from "../components/sections/BusinessValue";
import { HowItWorks } from "../components/sections/HowItWorks";
import { TargetUsers } from "../components/sections/TargetUsers";
import { PilotPlan } from "../components/sections/PilotPlan";
import { DemoForm } from "../components/sections/DemoForm";
import { Faq } from "../components/sections/Faq";
import { Footer } from "../components/sections/Footer";
import { CursorDotWave } from "../components/ui/CursorDotWave";
import { QuickQuestionsWidget } from "../features/quickQuestions";
import { track } from "../lib/analytics";

export function Home() {
  useEffect(() => {
    track("page_viewed", { page: "landing" });
  }, []);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <CursorDotWave />
      <PromoBanner />
      <TopNav />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Features />
<BusinessValue />
        <HowItWorks />
        <TargetUsers />
        <PilotPlan />
        <DemoForm />
        <Faq />
      </main>
      <Footer />
      <QuickQuestionsWidget />
    </div>
  );
}
