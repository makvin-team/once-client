// In-memory mock data for early UI development. Pages read from these
// fixtures via thin selectors so the same shape works against a real
// backend later.

import type {
  Assignment,
  AuditLog,
  Branch,
  Department,
  FraudScenario,
  IntegrationLog,
  KnowledgeDocument,
  LearningPlan,
  Lesson,
  Module,
  Notification,
  Position,
  Progress,
  RoleCode,
  SimulatorScenario,
  Skill,
  SkillScore,
  User,
} from "./entities";

// ----------------------------- Users ------------------------------------

export const mockUsers: ReadonlyArray<User & { roleCode: RoleCode }> = [
  {
    id: "u_learner",
    fullName: "Aziz Karimov",
    email: "aziz.karimov@bank.uz",
    phone: "+998 90 123 45 67",
    employeeId: "BK-00214",
    branchId: "br_main",
    departmentId: "dep_ops",
    positionId: "pos_operator",
    roles: ["user"],
    status: "active",
    joinedAt: "2026-01-12",
    roleCode: "user",
  },
  {
    id: "u_hr",
    fullName: "Dilnoza Sodiqova",
    email: "dilnoza.s@bank.uz",
    roles: ["hr"],
    status: "active",
    joinedAt: "2025-08-04",
    roleCode: "hr",
  },
  {
    id: "u_root",
    fullName: "Once Admin",
    email: "admin@once.uz",
    roles: ["admin"],
    status: "active",
    joinedAt: "2025-01-01",
    roleCode: "admin",
  },
];

export const mockLearners: User[] = Array.from({ length: 24 }, (_, i) => ({
  id: `lr_${i + 1}`,
  fullName: [
    "Aziz Karimov",
    "Madina Rashidova",
    "Otabek Saidov",
    "Nigora Pirmuhamedova",
    "Ravshan Tursunov",
    "Yulduz Eshmurodova",
    "Jasur Komilov",
    "Iroda Akbarova",
  ][i % 8] + ` ${i + 1}`,
  email: `learner${i + 1}@bank.uz`,
  employeeId: `BK-${String(1000 + i).padStart(5, "0")}`,
  branchId: ["br_main", "br_chilonzor", "br_yunusobod", "br_mirzoulugbek"][i % 4],
  departmentId: ["dep_ops", "dep_credit", "dep_callcenter", "dep_cards"][i % 4],
  positionId: ["pos_operator", "pos_senior_op", "pos_callagent", "pos_branchmgr"][i % 4],
  roles: ["user"],
  status: i % 7 === 6 ? "pending" : i % 5 === 4 ? "blocked" : "active",
  joinedAt: `2026-0${(i % 5) + 1}-${String((i % 27) + 1).padStart(2, "0")}`,
}));

// ----------------------------- Org --------------------------------------

export const mockBranches: Branch[] = [
  { id: "br_main", name: "Bosh ofis", city: "Toshkent" },
  { id: "br_chilonzor", name: "Chilonzor filiali", city: "Toshkent" },
  { id: "br_yunusobod", name: "Yunusobod filiali", city: "Toshkent" },
  { id: "br_mirzoulugbek", name: "Mirzo Ulug'bek filiali", city: "Toshkent" },
  { id: "br_samarkand", name: "Samarqand filiali", city: "Samarqand" },
];

export const mockDepartments: Department[] = [
  { id: "dep_ops", name: "Operatsion bo'lim", branchId: "br_main" },
  { id: "dep_credit", name: "Kredit bo'limi", branchId: "br_main" },
  { id: "dep_callcenter", name: "Call-center", branchId: "br_main" },
  { id: "dep_cards", name: "Plastik kartalar", branchId: "br_main" },
  { id: "dep_compliance", name: "Compliance", branchId: "br_main" },
];

export const mockPositions: Position[] = [
  { id: "pos_operator", title: "Operator", departmentId: "dep_ops" },
  { id: "pos_senior_op", title: "Senior operator", departmentId: "dep_ops" },
  { id: "pos_callagent", title: "Call-agent", departmentId: "dep_callcenter" },
  { id: "pos_branchmgr", title: "Filial rahbari", departmentId: "dep_ops" },
  { id: "pos_creditmgr", title: "Kredit menejeri", departmentId: "dep_credit" },
];

// ----------------------------- Learning Content -------------------------

export const mockLearningPlans: LearningPlan[] = [
  {
    id: "plan_operator",
    name: "Operator onboarding (60 kun)",
    description:
      "Yangi operator uchun 60 kunlik onboarding rejasi: AML asoslari, ABS workflow, mijoz xizmati va fraud awareness.",
    moduleIds: ["mod_aml", "mod_abs", "mod_service", "mod_fraud"],
    status: "published",
    deadlineAt: "2026-08-31",
    passThreshold: 75,
    createdAt: "2026-04-12",
    createdBy: "u_training",
    targetPositionIds: ["pos_operator"],
  },
  {
    id: "plan_callagent",
    name: "Call-agent onboarding",
    description: "Call-center xodimlari uchun 30 kunlik o'quv reja.",
    moduleIds: ["mod_service", "mod_fraud"],
    status: "published",
    createdAt: "2026-03-20",
    createdBy: "u_training",
    targetPositionIds: ["pos_callagent"],
  },
  {
    id: "plan_credit",
    name: "Kredit menejeri intermediate",
    description: "Kredit menejerlari uchun KYC va risk treningi.",
    moduleIds: ["mod_aml", "mod_compliance"],
    status: "draft",
    createdAt: "2026-05-02",
    createdBy: "u_training",
    targetPositionIds: ["pos_creditmgr"],
  },
];

export const mockModules: Module[] = [
  {
    id: "mod_aml",
    name: "AML asoslari",
    description: "Anti-money-laundering qoidalari va red flag'lar.",
    lessonIds: ["les_aml_1", "les_aml_2"],
    quizIds: ["quiz_aml"],
    order: 1,
    status: "published",
  },
  {
    id: "mod_abs",
    name: "ABS workflow",
    description: "Bank Avtomatlashtirilgan Tizimi bilan ishlash.",
    lessonIds: ["les_abs_1"],
    quizIds: [],
    simulatorScenarioIds: ["scen_open_account"],
    order: 2,
    status: "published",
  },
  {
    id: "mod_service",
    name: "Mijoz xizmati",
    description: "Mijoz bilan muloqot standartlari.",
    lessonIds: ["les_service_1"],
    quizIds: [],
    order: 3,
    status: "published",
  },
  {
    id: "mod_fraud",
    name: "Fraud awareness",
    description: "Phishing, deepfake, social engineering scenariy'lari.",
    lessonIds: ["les_fraud_intro"],
    quizIds: [],
    fraudScenarioIds: ["fr_phish_1", "fr_susp_tx", "fr_deepfake"],
    order: 4,
    status: "published",
  },
  {
    id: "mod_compliance",
    name: "Compliance & KYC",
    description: "Mijoz tekshiruvi va compliance qoidalari.",
    lessonIds: [],
    quizIds: [],
    order: 5,
    status: "draft",
  },
];

export const mockLessons: Lesson[] = [
  {
    id: "les_aml_1",
    title: "AML nima va nima uchun muhim",
    kind: "text",
    body:
      "Anti-money laundering (AML) — bank xodimlari uchun ish protsessining markaziy qismi. Bu darsda asosiy tushunchalar, qonunchilik talablari va xodimning kundalik vazifalari ko'rib chiqiladi.\n\nAML standartlari Markaziy bank reglamentlari va FATF tavsiyalariga asoslangan. Har bir bank xodimi mijoz operatsiyalarida red-flag'larni tanish qobiliyatiga ega bo'lishi kerak.",
    estimatedMinutes: 8,
    completionRule: "mark_as_complete",
    order: 1,
  },
  {
    id: "les_aml_2",
    title: "Red flag'lar ro'yxati",
    kind: "checklist",
    checklistItems: [
      { id: "rf_1", label: "Mijoz manbasi noaniq bo'lgan katta naqd to'lov" },
      { id: "rf_2", label: "Bir necha hisob orasidagi tez transferlar" },
      { id: "rf_3", label: "Hujjat va shaxs nomuvofiqligi" },
      { id: "rf_4", label: "Mijoz savollardan qochishi" },
      { id: "rf_5", label: "Notipik geografik faollik" },
    ],
    estimatedMinutes: 5,
    completionRule: "mark_as_complete",
    order: 2,
  },
  {
    id: "les_abs_1",
    title: "ABS interfeysi bilan tanishuv",
    kind: "video",
    videoUrl: "https://example.com/video/abs-intro",
    estimatedMinutes: 12,
    completionRule: "auto",
    order: 1,
  },
  {
    id: "les_service_1",
    title: "Mijoz bilan muloqot standartlari",
    kind: "text",
    body:
      "Mijoz bilan muloqotning besh asosiy qoidasi: aniq, professional, empatik, ishonchli va vaqtni hurmat qiladigan tarzda gaplashish.",
    estimatedMinutes: 6,
    completionRule: "mark_as_complete",
    order: 1,
  },
  {
    id: "les_fraud_intro",
    title: "Zamonaviy fraud trendlari",
    kind: "text",
    body:
      "Deepfake call, social engineering va sun'iy intellekt orqali yaratilgan phishing — yangi avlod tahdidlari. Bu darsda har bir trend tahlil qilinadi.",
    estimatedMinutes: 7,
    completionRule: "mark_as_complete",
    order: 1,
  },
];

// ----------------------------- Progress ---------------------------------

export const mockProgress: Progress[] = [
  {
    id: "pr_1",
    userId: "u_learner",
    planId: "plan_operator",
    moduleId: "mod_aml",
    status: "completed",
    percent: 100,
    score: 88,
    completedAt: "2026-04-22",
    timeSpentSeconds: 4200,
    lastActivityAt: "2026-04-22T18:30:00Z",
  },
  {
    id: "pr_2",
    userId: "u_learner",
    planId: "plan_operator",
    moduleId: "mod_abs",
    status: "in_progress",
    percent: 45,
    timeSpentSeconds: 1860,
    lastActivityAt: "2026-05-15T09:12:00Z",
  },
  {
    id: "pr_3",
    userId: "u_learner",
    planId: "plan_operator",
    moduleId: "mod_service",
    status: "not_started",
    percent: 0,
  },
  {
    id: "pr_4",
    userId: "u_learner",
    planId: "plan_operator",
    moduleId: "mod_fraud",
    status: "locked",
    percent: 0,
  },
];

// ----------------------------- Assignments ------------------------------

export const mockAssignments: Assignment[] = [
  {
    id: "asg_1",
    planId: "plan_operator",
    target: { kind: "position", id: "pos_operator" },
    startAt: "2026-04-01",
    dueAt: "2026-08-31",
    mandatory: true,
    status: "in_progress",
    createdAt: "2026-03-25",
    createdBy: "u_hr",
  },
  {
    id: "asg_2",
    planId: "plan_callagent",
    target: { kind: "position", id: "pos_callagent" },
    startAt: "2026-05-01",
    dueAt: "2026-06-30",
    mandatory: true,
    status: "in_progress",
    createdAt: "2026-04-25",
    createdBy: "u_hr",
  },
];

// ----------------------------- Skills -----------------------------------

export const mockSkills: Skill[] = [
  { id: "sk_aml", name: "AML asoslari", category: "compliance" },
  { id: "sk_abs", name: "ABS workflow", category: "abs_crm" },
  { id: "sk_service", name: "Mijoz xizmati", category: "customer_service" },
  { id: "sk_fraud", name: "Fraud aniqlash", category: "fraud_awareness" },
  { id: "sk_ai", name: "AI yordamchidan foydalanish", category: "ai_productivity" },
];

export const mockSkillScores: SkillScore[] = [
  { id: "sc_1", userId: "u_learner", skillId: "sk_aml", score: 88, updatedAt: "2026-04-22" },
  { id: "sc_2", userId: "u_learner", skillId: "sk_abs", score: 62, updatedAt: "2026-05-15" },
  { id: "sc_3", userId: "u_learner", skillId: "sk_service", score: 71, updatedAt: "2026-05-01" },
  { id: "sc_4", userId: "u_learner", skillId: "sk_fraud", score: 45, updatedAt: "2026-05-10" },
];

// ----------------------------- Documents / KB ---------------------------

export const mockDocuments: KnowledgeDocument[] = [
  {
    id: "doc_aml_reg",
    title: "AML reglamenti v2.4",
    category: "Compliance",
    fileType: "pdf",
    sizeBytes: 2_400_000,
    version: 4,
    status: "active",
    uploadedAt: "2026-04-12T09:30:00Z",
    uploadedBy: "u_content",
    indexedAt: "2026-04-12T09:35:12Z",
  },
  {
    id: "doc_kyc",
    title: "KYC tartibi va red-flag'lar",
    category: "Compliance",
    fileType: "docx",
    sizeBytes: 480_000,
    version: 2,
    status: "active",
    uploadedAt: "2026-03-18T11:00:00Z",
    uploadedBy: "u_content",
    indexedAt: "2026-03-18T11:02:08Z",
  },
  {
    id: "doc_abs_manual",
    title: "ABS foydalanuvchi qo'llanma",
    category: "ABS / CRM",
    fileType: "pdf",
    sizeBytes: 8_900_000,
    version: 1,
    status: "processing",
    uploadedAt: "2026-05-16T15:20:00Z",
    uploadedBy: "u_content",
  },
  {
    id: "doc_dresscode",
    title: "Dress code va etiket",
    category: "HR",
    fileType: "pdf",
    sizeBytes: 350_000,
    version: 1,
    status: "active",
    uploadedAt: "2025-12-01T10:00:00Z",
    uploadedBy: "u_hr",
    indexedAt: "2025-12-01T10:02:00Z",
  },
];

// ----------------------------- Scenarios --------------------------------

export const mockSimScenarios: SimulatorScenario[] = [
  {
    id: "scen_open_account",
    name: "Mijozga hisob ochish",
    kind: "bank_workflow",
    description: "Yangi mijoz uchun hisob ochish workflow'i.",
    targetPositionIds: ["pos_operator"],
    difficulty: "medium",
    expectedSteps: [
      { id: "s1", label: "Mijoz hujjatlarini tekshirish", weight: 1 },
      { id: "s2", label: "KYC red-flag'larni tekshirish", weight: 2 },
      { id: "s3", label: "Hisob turini tanlash", weight: 1 },
      { id: "s4", label: "Kelishuvni rasmiylashtirish", weight: 1 },
    ],
    status: "published",
  },
  {
    id: "scen_card_issue",
    name: "Karta rasmiylashtirish",
    kind: "abs_crm_workflow",
    targetPositionIds: ["pos_operator"],
    difficulty: "easy",
    expectedSteps: [
      { id: "s1", label: "Mijoz so'rovini qabul qilish", weight: 1 },
      { id: "s2", label: "Pasport ma'lumotlarini ABS'ga kiritish", weight: 1 },
      { id: "s3", label: "Karta tarifi tanlash", weight: 1 },
    ],
    status: "published",
  },
  {
    id: "scen_angry_customer",
    name: "Norozi mijoz",
    kind: "virtual_customer",
    difficulty: "hard",
    expectedSteps: [
      { id: "s1", label: "Faol tinglash", weight: 2 },
      { id: "s2", label: "Empatik javob", weight: 2 },
      { id: "s3", label: "To'g'ri yechim taklif qilish", weight: 3 },
    ],
    status: "published",
  },
];

export const mockFraudScenarios: FraudScenario[] = [
  {
    id: "fr_phish_1",
    name: "SWIFT phishing emaili",
    fraudType: "phishing",
    riskLevel: "high",
    redFlags: [
      "Bank domenidan tashqari email yuboruvchi",
      "Shoshilinch ko'rsatma ohangi",
      "Shubhali havola URL'i",
    ],
    expectedActions: [
      { id: "a1", label: "Email manbasini tekshirish", weight: 2 },
      { id: "a2", label: "Compliance bo'limiga eskalatsiya qilish", weight: 3 },
      { id: "a3", label: "Havolaga bosmaslik", weight: 2 },
    ],
    difficulty: "medium",
    status: "published",
  },
  {
    id: "fr_susp_tx",
    name: "Shubhali tranzaksiya",
    fraudType: "suspicious_transaction",
    riskLevel: "critical",
    redFlags: [
      "Mijoz odatiy faollikdan uzoq summa",
      "Tez-tez kichik miqdorlar bilan ortilgan operatsiyalar",
      "Geografik moslik buzilishi",
    ],
    expectedActions: [
      { id: "a1", label: "Operatsiyani vaqtincha to'xtatish", weight: 3 },
      { id: "a2", label: "Compliance'ga ogohlantirish", weight: 3 },
    ],
    difficulty: "hard",
    status: "published",
  },
  {
    id: "fr_deepfake",
    name: "Deepfake VIP qo'ng'iroq",
    fraudType: "deepfake_call",
    riskLevel: "high",
    redFlags: [
      "Audio sifati g'alati",
      "VIP mijoz odatdagi protokolni o'tkazib yuborishni so'rashi",
      "Telefon raqami noma'lum",
    ],
    expectedActions: [
      { id: "a1", label: "Identifikatsiyani so'rash", weight: 3 },
      { id: "a2", label: "Qayta qo'ng'iroq taklif qilish", weight: 2 },
    ],
    difficulty: "hard",
    status: "published",
  },
];

// ----------------------------- Notifications ----------------------------

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    kind: "new_task",
    title: "Yangi modul ochildi: ABS workflow",
    body: "O'quv rejangizdagi keyingi modul tayyor.",
    userId: "u_learner",
    status: "sent",
    read: false,
    createdAt: "2026-05-16T08:00:00Z",
    ctaHref: "/learner/plans",
  },
  {
    id: "n2",
    kind: "assessment_result",
    title: "AML quiz natijasi: 88%",
    body: "Tabriklaymiz, siz threshold'dan o'tdingiz.",
    userId: "u_learner",
    status: "sent",
    read: false,
    createdAt: "2026-04-22T18:35:00Z",
  },
  {
    id: "n3",
    kind: "deadline",
    title: "Operator onboarding deadline yaqinlashmoqda",
    body: "31-avgustgacha qolgan 14 kun.",
    userId: "u_learner",
    status: "sent",
    read: true,
    createdAt: "2026-05-15T09:00:00Z",
  },
];

// ----------------------------- Integration ------------------------------

export const mockIntegrationLogs: IntegrationLog[] = [
  {
    id: "il_1",
    type: "ispring",
    action: "result_sync",
    status: "ok",
    attemptedAt: "2026-05-16T11:00:00Z",
  },
  {
    id: "il_2",
    type: "lms",
    action: "completion_sync",
    status: "failed",
    message: "Connection timeout",
    attemptedAt: "2026-05-15T22:00:00Z",
  },
  {
    id: "il_3",
    type: "lms",
    action: "completion_sync",
    status: "retrying",
    attemptedAt: "2026-05-16T02:00:00Z",
  },
];

// ----------------------------- Audit ------------------------------------

export const mockAuditLogs: AuditLog[] = [
  {
    id: "log_1",
    action: "user.login",
    actorId: "u_hr",
    actorName: "Dilnoza Sodiqova",
    ip: "192.168.10.4",
    status: "ok",
    at: "2026-05-17T07:42:11Z",
  },
  {
    id: "log_2",
    action: "plan.published",
    actorId: "u_training",
    actorName: "Bekzod Yusupov",
    targetEntity: "LearningPlan",
    targetId: "plan_callagent",
    status: "ok",
    at: "2026-05-16T15:08:00Z",
    details: "Call-agent onboarding plani publish qilindi",
  },
  {
    id: "log_3",
    action: "document.upload",
    actorId: "u_content",
    actorName: "Sherzod Aliyev",
    targetEntity: "KnowledgeDocument",
    targetId: "doc_abs_manual",
    status: "ok",
    at: "2026-05-16T15:20:00Z",
  },
];

// ----------------------------- Selectors --------------------------------

export function getUserById(id: string) {
  return mockUsers.find((u) => u.id === id);
}

export function getPlanById(id: string) {
  return mockLearningPlans.find((p) => p.id === id);
}

export function getModuleById(id: string) {
  return mockModules.find((m) => m.id === id);
}

export function getLessonById(id: string) {
  return mockLessons.find((l) => l.id === id);
}

export function getProgressForUser(userId: string) {
  return mockProgress.filter((p) => p.userId === userId);
}

export function getNotificationsForUser(userId: string) {
  return mockNotifications.filter((n) => !n.userId || n.userId === userId);
}
