import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { RequireAuth } from "./auth/RequireAuth";
import { RequireRole } from "./auth/RequireRole";
import { Forbidden } from "./pages/Forbidden";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
// Learner
import { LearnerLayout } from "./pages/learner/LearnerLayout";
import { LearnerDashboard } from "./pages/learner/Dashboard";
import { LearnerPlans } from "./pages/learner/Plans";
import { LearnerPlanDetail } from "./pages/learner/PlanDetail";
import { LearnerModuleDetail } from "./pages/learner/ModuleDetail";
import { LearnerAssistant } from "./pages/learner/Assistant";
import {
  LearnerNotifications,
  LearnerProgress,
  LearnerSettings,
} from "./pages/learner/stubs";
// Admin
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminUsers } from "./pages/admin/Users";
import { AdminKnowledge } from "./pages/admin/Knowledge";
import { AdminFraudScenarios } from "./pages/admin/FraudScenarios";
import {
  AdminAIAssistant,
  AdminAssignments,
  AdminMockScenarios,
  AdminModules,
  AdminNotifications,
  AdminOrg,
  AdminPlans,
  AdminProgress,
  AdminQuizzes,
  AdminReports,
  AdminSettings,
  AdminSkills,
} from "./pages/admin/stubs";

// The Playground / Dialog / Fraud practice surfaces were consolidated into the
// simulator, which is served outside the SPA (reverse-proxied) at
// /learner/simulator. Reach it with a real browser navigation — a React-Router
// redirect would only hit the SPA fallback, never the proxied page.
function SimulatorRedirect() {
  useEffect(() => {
    window.location.replace("/learner/simulator");
  }, []);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forbidden" element={<Forbidden />} />

          {/* Authenticated app routes */}
          <Route element={<RequireAuth />}>
            {/* Learner Site */}
            <Route element={<RequireRole mode="learner" />}>
              <Route path="/learner" element={<LearnerLayout />}>
                <Route index element={<LearnerDashboard />} />
                <Route path="plans" element={<LearnerPlans />} />
                <Route path="plans/:planId" element={<LearnerPlanDetail />} />
                <Route
                  path="plans/:planId/modules/:moduleId"
                  element={<LearnerModuleDetail />}
                />
                <Route path="assistant" element={<LearnerAssistant />} />
                <Route path="playground" element={<SimulatorRedirect />} />
                <Route path="dialog" element={<SimulatorRedirect />} />
                <Route path="fraud" element={<SimulatorRedirect />} />
                <Route path="progress" element={<LearnerProgress />} />
                <Route path="notifications" element={<LearnerNotifications />} />
                <Route path="settings" element={<LearnerSettings />} />
              </Route>
            </Route>

            {/* Admin Site */}
            <Route element={<RequireRole mode="admin" />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="org" element={<AdminOrg />} />
                <Route path="knowledge" element={<AdminKnowledge />} />
                <Route path="assistant" element={<AdminAIAssistant />} />
                <Route path="plans" element={<AdminPlans />} />
                <Route path="modules" element={<AdminModules />} />
                <Route path="quizzes" element={<AdminQuizzes />} />
                <Route
                  path="scenarios/mock"
                  element={<AdminMockScenarios />}
                />
                <Route
                  path="scenarios/fraud"
                  element={<AdminFraudScenarios />}
                />
                <Route path="assignments" element={<AdminAssignments />} />
                <Route path="progress" element={<AdminProgress />} />
                <Route path="skills" element={<AdminSkills />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="notifications" element={<AdminNotifications />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
