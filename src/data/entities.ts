// Domain types for the Learner Site + Admin Site.
//
// These mirror the 25+ entities listed in the TZ § 6. They are kept thin
// (data-only, no methods) so they can be shared between client state, mock
// fixtures, and eventually a generated client from the backend OpenAPI spec.

// ----------------------------- Identifiers -----------------------------

export type Id = string;
export type ISODate = string;

// ----------------------------- Role & Permission ------------------------

// Backend `EnumRole` (Once.Domain.Enums.EnumRole). JWT "Role" claim arrives as
// the enum name (e.g. "Admin"); we lowercase it on read to keep the client
// code case-insensitive.
export type RoleCode = "admin" | "hr" | "user";

export const ROLE_NUMERIC: Record<RoleCode, 1 | 2 | 3> = {
  admin: 1,
  hr: 2,
  user: 3,
};

export type Permission =
  // Learner-facing
  | "learner.read_own"
  | "learner.use_assistant"
  | "learner.submit_attempt"
  | "learner.send_feedback"
  // User management
  | "user.read"
  | "user.create"
  | "user.update"
  | "user.block"
  // Org structure
  | "org.manage"
  // Knowledge base & AI
  | "kb.read"
  | "kb.upload"
  | "kb.delete"
  | "ai.configure"
  | "ai.review_logs"
  // Learning content
  | "plan.create"
  | "plan.update"
  | "plan.publish"
  | "module.manage"
  | "quiz.manage"
  // Simulators
  | "scenario.mock.manage"
  | "scenario.fraud.manage"
  | "scenario.fraud.report"
  // Assignment & progress
  | "assignment.create"
  | "progress.read_all"
  | "skills.read_all"
  // Reports & integration
  | "report.export"
  | "integration.manage"
  // Notifications
  | "notification.send"
  // System
  | "audit.read"
  | "system.settings"
  | "role.manage";

export type Role = {
  code: RoleCode;
  permissions: ReadonlyArray<Permission>;
};

// ----------------------------- Users ------------------------------------

export type UserStatus = "active" | "inactive" | "blocked" | "pending";

export type User = {
  id: Id;
  fullName: string;
  email: string;
  phone?: string;
  employeeId?: string;
  branchId?: Id;
  departmentId?: Id;
  positionId?: Id;
  groupIds?: Id[];
  roles: RoleCode[];
  status: UserStatus;
  joinedAt: ISODate;
  avatarUrl?: string;
};

// ----------------------------- Organization -----------------------------

export type Branch = {
  id: Id;
  name: string;
  city?: string;
  managerId?: Id;
};

export type Department = {
  id: Id;
  name: string;
  branchId?: Id;
};

export type Position = {
  id: Id;
  title: string;
  departmentId?: Id;
};

export type EmployeeGroup = {
  id: Id;
  name: string;
  description?: string;
  memberIds: Id[];
};

export type TrainingGroup = EmployeeGroup;

// ----------------------------- Knowledge Base ---------------------------

export type DocumentStatus =
  | "uploaded"
  | "processing"
  | "active"
  | "failed"
  | "archived";

export type KnowledgeDocument = {
  id: Id;
  title: string;
  category?: string;
  fileType: "pdf" | "docx" | "txt" | "md" | "html";
  sizeBytes: number;
  version: number;
  status: DocumentStatus;
  uploadedAt: ISODate;
  uploadedBy: Id;
  indexedAt?: ISODate;
  visibilityRoleCodes?: RoleCode[];
  sourceMetadata?: Record<string, string>;
};

// ----------------------------- Learning Content -------------------------

export type LearningPlanStatus = "draft" | "published" | "archived";

export type LearningPlan = {
  id: Id;
  name: string;
  description?: string;
  targetPositionIds?: Id[];
  targetGroupIds?: Id[];
  moduleIds: Id[];
  status: LearningPlanStatus;
  deadlineAt?: ISODate;
  passThreshold?: number;
  createdAt: ISODate;
  createdBy: Id;
};

export type ModuleStatus = "draft" | "published" | "archived";

export type Module = {
  id: Id;
  name: string;
  description?: string;
  lessonIds: Id[];
  quizIds: Id[];
  simulatorScenarioIds?: Id[];
  fraudScenarioIds?: Id[];
  dependencyModuleIds?: Id[];
  order: number;
  status: ModuleStatus;
};

export type LessonContentKind =
  | "text"
  | "pdf"
  | "video"
  | "presentation"
  | "checklist"
  | "quiz"
  | "interactive"
  | "simulator";

export type Lesson = {
  id: Id;
  title: string;
  kind: LessonContentKind;
  body?: string;
  fileUrl?: string;
  videoUrl?: string;
  checklistItems?: ReadonlyArray<{ id: Id; label: string }>;
  estimatedMinutes?: number;
  completionRule?: "mark_as_complete" | "auto" | "passed_quiz";
  order: number;
};

// ----------------------------- Quiz -------------------------------------

export type QuestionKind =
  | "single_choice"
  | "multiple_choice"
  | "true_false"
  | "scenario"
  | "short_text";

export type Question = {
  id: Id;
  prompt: string;
  kind: QuestionKind;
  answerIds: Id[];
  correctAnswerIds: Id[];
  scoreWeight: number;
  feedback?: string;
};

export type Answer = {
  id: Id;
  label: string;
};

export type Quiz = {
  id: Id;
  title: string;
  description?: string;
  questionIds: Id[];
  timeLimitMinutes?: number;
  passScore: number;
  attemptLimit?: number;
  randomize: boolean;
};

// ----------------------------- Assignment & Progress --------------------

export type AssignmentTarget =
  | { kind: "user"; id: Id }
  | { kind: "group"; id: Id }
  | { kind: "position"; id: Id }
  | { kind: "department"; id: Id }
  | { kind: "branch"; id: Id }
  | { kind: "all" };

export type AssignmentStatus =
  | "assigned"
  | "in_progress"
  | "completed"
  | "failed"
  | "expired";

export type Assignment = {
  id: Id;
  planId: Id;
  target: AssignmentTarget;
  startAt: ISODate;
  dueAt?: ISODate;
  mandatory: boolean;
  status: AssignmentStatus;
  createdAt: ISODate;
  createdBy: Id;
};

export type ModuleProgressStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "failed"
  | "locked";

export type Progress = {
  id: Id;
  userId: Id;
  planId: Id;
  moduleId: Id;
  status: ModuleProgressStatus;
  percent: number;
  score?: number;
  startedAt?: ISODate;
  completedAt?: ISODate;
  timeSpentSeconds?: number;
  lastActivityAt?: ISODate;
};

// ----------------------------- Skill ------------------------------------

export type SkillCategory =
  | "internal_rules"
  | "customer_service"
  | "abs_crm"
  | "fraud_awareness"
  | "compliance"
  | "ai_productivity"
  | "product_knowledge";

export type Skill = {
  id: Id;
  name: string;
  category: SkillCategory;
  description?: string;
};

export type SkillScore = {
  id: Id;
  userId: Id;
  skillId: Id;
  score: number;
  updatedAt: ISODate;
};

// ----------------------------- AI ---------------------------------------

export type AIConversation = {
  id: Id;
  userId: Id;
  messages: ReadonlyArray<{
    id: Id;
    role: "user" | "assistant";
    text: string;
    citations?: ReadonlyArray<{ documentId: Id; title: string; section?: string }>;
    createdAt: ISODate;
  }>;
  createdAt: ISODate;
};

export type AIAnswerFeedback = {
  id: Id;
  conversationId: Id;
  messageId: Id;
  userId: Id;
  helpful: boolean;
  reason?: string;
  createdAt: ISODate;
};

// ----------------------------- Simulators -------------------------------

export type Difficulty = "easy" | "medium" | "hard" | "adaptive";

export type SimulatorScenarioKind =
  | "bank_workflow"
  | "virtual_customer"
  | "abs_crm_workflow"
  | "document_verification"
  | "suspicious_operation";

export type SimulatorScenario = {
  id: Id;
  name: string;
  description?: string;
  kind: SimulatorScenarioKind;
  targetPositionIds?: Id[];
  difficulty: Difficulty;
  initialData?: Record<string, unknown>;
  expectedSteps: ReadonlyArray<{ id: Id; label: string; weight: number }>;
  scoringRules?: Record<string, number>;
  feedbackMessages?: Record<string, string>;
  status: "draft" | "published" | "archived";
};

export type AttemptStatus = "started" | "submitted" | "passed" | "failed";

export type SimulatorAttempt = {
  id: Id;
  scenarioId: Id;
  userId: Id;
  status: AttemptStatus;
  score?: number;
  startedAt: ISODate;
  submittedAt?: ISODate;
  stepResults?: ReadonlyArray<{ stepId: Id; passed: boolean }>;
};

export type FraudType =
  | "phishing"
  | "suspicious_transaction"
  | "fake_document"
  | "deepfake_call"
  | "social_engineering"
  | "aml_kyc_red_flag";

export type FraudScenario = {
  id: Id;
  name: string;
  fraudType: FraudType;
  riskLevel: "low" | "medium" | "high" | "critical";
  redFlags: ReadonlyArray<string>;
  expectedActions: ReadonlyArray<{ id: Id; label: string; weight: number }>;
  explanation?: string;
  recommendation?: string;
  difficulty: Difficulty;
  status: "draft" | "published" | "archived";
};

export type FraudAttempt = {
  id: Id;
  scenarioId: Id;
  userId: Id;
  status: AttemptStatus;
  score?: number;
  fraudAwarenessScore?: number;
  missedFlags?: ReadonlyArray<string>;
  startedAt: ISODate;
  submittedAt?: ISODate;
};

// ----------------------------- Notifications ----------------------------

export type NotificationKind =
  | "new_plan"
  | "new_task"
  | "deadline"
  | "assessment_result"
  | "admin_feedback"
  | "retry_required"
  | "certificate_ready"
  | "admin_announcement";

export type NotificationStatus = "draft" | "sent" | "failed";

export type Notification = {
  id: Id;
  kind: NotificationKind;
  title: string;
  body?: string;
  userId?: Id;
  status: NotificationStatus;
  read?: boolean;
  createdAt: ISODate;
  ctaHref?: string;
};

// ----------------------------- Reports / Audit / Integration ------------

export type Report = {
  id: Id;
  kind:
    | "onboarding_progress"
    | "learner_completion"
    | "quiz_result"
    | "fraud_awareness"
    | "skill_gap"
    | "department_branch_performance"
    | "ai_assistant_usage"
    | "content_effectiveness";
  generatedAt: ISODate;
  url?: string;
};

export type IntegrationLog = {
  id: Id;
  type: "lms" | "ispring";
  action: "result_sync" | "completion_sync" | "score_sync";
  status: "ok" | "failed" | "retrying";
  message?: string;
  attemptedAt: ISODate;
};

export type AuditLog = {
  id: Id;
  action: string;
  actorId: Id;
  actorName: string;
  targetEntity?: string;
  targetId?: Id;
  ip?: string;
  status: "ok" | "denied" | "failed";
  details?: string;
  at: ISODate;
};
