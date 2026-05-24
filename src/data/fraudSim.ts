// Learner-facing Fraud Simulator mock data.
//
// The admin-side FraudScenario in ./entities.ts is intentionally lean (red
// flags as strings, no per-step evidence). The learner simulator needs a
// richer shape: per-type evidence, identifiable red flag options the user
// can tick, decision options with one correct answer, and a per-user
// attempts log. Rather than overload the admin entity, the learner UI
// reads from this dedicated file.

export type FraudSimType =
  | "phishing"
  | "transaction"
  | "document"
  | "deepfake_call"
  | "social_engineering"
  | "aml_kyc";

export type FraudSimDifficulty = "beginner" | "intermediate" | "advanced";
export type FraudSimRisk = "low" | "medium" | "high";

export type FraudSimStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "failed";

export type RedFlagOption = {
  id: string;
  label: string;
  correct: boolean;
};

export type DecisionOption = {
  id: string;
  label: string;
  correct: boolean;
};

// Evidence is rendered differently per fraud type. We model it as a tagged
// union so the play-mode component can switch on `kind` and render the
// right surface (phishing email, transaction sheet, etc.).
export type FraudEvidence =
  | {
      kind: "phishing";
      senderName: string;
      senderEmail: string;
      subject: string;
      body: string;
      link: string;
      attachment: string;
      receivedAt: string;
    }
  | {
      kind: "transaction";
      customerName: string;
      accountAge: string;
      amount: string;
      destinationCountry: string;
      frequency: string;
      description: string;
      usualBehavior: string;
    }
  | {
      kind: "document";
      documentType: string;
      documentNumber: string;
      issueDate: string;
      customerInfo: string;
      inconsistencies: ReadonlyArray<string>;
    }
  | {
      kind: "deepfake_call";
      callerName: string;
      callerRole: string;
      transcript: string;
      urgency: string;
      requestedAction: string;
      suspiciousPhrases: ReadonlyArray<string>;
    }
  | {
      kind: "social_engineering";
      actorIdentity: string;
      channel: string;
      requestedAction: string;
      pressureTactic: string;
      policyHint: string;
    }
  | {
      kind: "aml_kyc";
      businessType: string;
      sourceOfFunds: string;
      transactionPattern: string;
      beneficialOwner: string;
      riskIndicators: ReadonlyArray<string>;
    };

export type FraudSimScenario = {
  id: string;
  title: string;
  description: string;
  fraudType: FraudSimType;
  difficulty: FraudSimDifficulty;
  riskLevel: FraudSimRisk;
  estimatedMinutes: number;
  passScore: number;
  averageScore: number;
  attempts: number;
  updatedAt: string;
  skills: ReadonlyArray<string>;
  context: string;
  learnerRole: string;
  task: string;
  evidence: FraudEvidence;
  redFlagOptions: ReadonlyArray<RedFlagOption>;
  decisionOptions: ReadonlyArray<DecisionOption>;
  explanation: string;
  recommendation: string;
  previousBest?: number;
  initialStatus: FraudSimStatus;
  playUrl?: string;
};

// NOTE: Type/difficulty/risk/status labels are sourced from i18n via
// t.app.fraud.{filters,status} — see src/pages/learner/Fraud.tsx. The
// enum keys (e.g. "phishing", "beginner") are the source of truth.

export const mockFraudScenarios: ReadonlyArray<FraudSimScenario> = [
  {
    id: "fs_phishing_01",
    title: "Phishing email aniqlash",
    description:
      "Noto'g'ri elektron xatlar orqali ma'lumot olish urinishlarini aniqlang.",
    fraudType: "phishing",
    difficulty: "beginner",
    riskLevel: "high",
    estimatedMinutes: 8,
    passScore: 70,
    averageScore: 78,
    attempts: 124,
    updatedAt: "2026-05-18",
    skills: ["Email xavfsizligi", "Domen tahlili", "Ijtimoiy muhandislik"],
    context:
      "Siz front-office xodimisiz. Mijoz nomidan bankka shubhali email kelgan.",
    learnerRole: "Front-office operator",
    task: "Emailni tekshirib, undagi xavf belgilarini aniqlang va to'g'ri qaror qabul qiling.",
    evidence: {
      kind: "phishing",
      senderName: "Bank Support",
      senderEmail: "support@bank-uz-secure.com",
      subject: "URGENT: Sizning hisobingiz bloklanmoqda — 24 soat ichida tasdiqlang",
      body: "Hurmatli mijoz, sizning hisobingizda shubhali faollik aniqlandi. Hisobingizni saqlab qolish uchun quyidagi havola orqali 24 soat ichida ma'lumotlaringizni tasdiqlang. Aks holda hisob butunlay bloklanadi.",
      link: "http://bank-uz-secure.com/verify?id=98217",
      attachment: "account-verification.html",
      receivedAt: "2026-05-21 03:14",
    },
    redFlagOptions: [
      { id: "rf1", label: "Shubhali domain (bank-uz-secure.com)", correct: true },
      { id: "rf2", label: "Juda shoshilinch talab (24 soat)", correct: true },
      { id: "rf3", label: "Havola HTTPS emas, HTTP", correct: true },
      { id: "rf4", label: "Shubhali HTML attachment", correct: true },
      { id: "rf5", label: "Tungi paytda yuborilgan (03:14)", correct: true },
      { id: "rf6", label: "Mijoz nomi to'liq yozilgan", correct: false },
      { id: "rf7", label: "Subject qatorida emoji bor", correct: false },
    ],
    decisionOptions: [
      { id: "d1", label: "Operatsiyani tasdiqlash", correct: false },
      { id: "d2", label: "Operatsiyani rad etish", correct: false },
      { id: "d3", label: "Qo'shimcha verifikatsiya so'rash", correct: false },
      {
        id: "d4",
        label: "Shubhali holat sifatida report qilish",
        correct: true,
      },
      { id: "d5", label: "Ogohlantirishni e'tiborsiz qoldirish", correct: false },
    ],
    explanation:
      "Email soxta domendan, shoshilinch matn bilan va xavfli attachment bilan yuborilgan — klassik phishing belgilari.",
    recommendation:
      "Bunday emaillarni IT xavfsizlik bo'limiga yuboring. Mijoz bilan to'g'ridan-to'g'ri ofitsial kanal orqali bog'laning.",
    initialStatus: "not_started",
  },
  {
    id: "fs_transaction_02",
    title: "Shubhali tranzaksiya",
    description: "Noto'g'ri yoki g'ayritabiiy tranzaksiyalarni tahlil qiling.",
    fraudType: "transaction",
    difficulty: "intermediate",
    riskLevel: "high",
    estimatedMinutes: 12,
    passScore: 70,
    averageScore: 64,
    attempts: 98,
    updatedAt: "2026-05-15",
    skills: ["Tranzaksiya monitoring", "Mijoz profilini tahlil", "Limit nazorati"],
    context:
      "Pensioner mijoz hisobida g'ayritabiiy katta o'tkazma signali kelgan.",
    learnerRole: "Tranzaksiya monitoring operatori",
    task: "Operatsiya tafsilotlarini ko'rib chiqing va tegishli qarorni qabul qiling.",
    evidence: {
      kind: "transaction",
      customerName: "Mavluda T., 67 yosh",
      accountAge: "11 yil",
      amount: "98 750 USD",
      destinationCountry: "Caymen orollari",
      frequency: "Oxirgi 12 oyda 1 marta xalqaro o'tkazma",
      description: "Maslahatchilik xizmatlari uchun to'lov",
      usualBehavior:
        "Odatda 200–500 USD oraliqda Toshkent ichidagi o'tkazmalar.",
    },
    redFlagOptions: [
      { id: "rf1", label: "Mijoz profiliga mos kelmaydigan summa", correct: true },
      { id: "rf2", label: "Yuqori risk yurisdiksiyasi (offshor)", correct: true },
      { id: "rf3", label: "Mijoz yoshiga mos kelmaydigan operatsiya", correct: true },
      { id: "rf4", label: "Mavhum tushuntirish ('maslahatchilik')", correct: true },
      { id: "rf5", label: "Hisob 11 yildan beri ochiq", correct: false },
      { id: "rf6", label: "O'tkazma USD'da", correct: false },
    ],
    decisionOptions: [
      { id: "d1", label: "Operatsiyani tasdiqlash", correct: false },
      { id: "d2", label: "Operatsiyani rad etish", correct: false },
      { id: "d3", label: "Compliance bo'limiga yuborish", correct: true },
      { id: "d4", label: "Qo'shimcha verifikatsiya so'rash", correct: false },
      { id: "d5", label: "Ogohlantirishni e'tiborsiz qoldirish", correct: false },
    ],
    explanation:
      "Mijoz odatdagi xulq-atvoridan keskin chiqqan o'tkazma + offshor manzil — AML signalining klassik kombinatsiyasi.",
    recommendation:
      "Bunday holatlar darhol Compliance/AML bo'limiga eskalatsiya qilinadi. STR (Suspicious Transaction Report) tayyorlash kerak.",
    previousBest: 58,
    initialStatus: "in_progress",
  },
  {
    id: "fs_document_03",
    title: "Soxta hujjat tekshiruvi",
    description: "Soxta yoki qalbakilashtirilgan hujjatlarni aniqlang.",
    fraudType: "document",
    difficulty: "intermediate",
    riskLevel: "medium",
    estimatedMinutes: 10,
    passScore: 70,
    averageScore: 72,
    attempts: 86,
    updatedAt: "2026-05-10",
    skills: ["Hujjat tekshiruvi", "Vizual nomuvofiqlik", "KYC"],
    context:
      "Yangi mijoz hisob ochish uchun pasport va daromad ma'lumotnomasini taqdim etgan.",
    learnerRole: "Front-office operator",
    task: "Hujjatlarni vizual tekshiring va xavfsiz hisob ochilishi mumkinligini hal qiling.",
    evidence: {
      kind: "document",
      documentType: "Pasport (ID kartochka)",
      documentNumber: "AA 5 612 943",
      issueDate: "2014-02-30",
      customerInfo: "Sherzod K., 1992 y.t., Toshkent sh.",
      inconsistencies: [
        "Berilgan sana mavjud emas (30-fevral)",
        "Hujjat raqami formatida bo'shliq noto'g'ri",
        "Tug'ilgan sana va yosh nomuvofiqligi (34 emas, 33)",
        "Imzo namunasi qora qalam bilan, hujjat ko'k siyoh bilan",
      ],
    },
    redFlagOptions: [
      { id: "rf1", label: "Hujjat sanasida nomuvofiqlik", correct: true },
      { id: "rf2", label: "Hujjat raqami format buzilishi", correct: true },
      { id: "rf3", label: "Imzo siyoh rangi farqi", correct: true },
      { id: "rf4", label: "Tug'ilgan sana / yosh nomuvofiq", correct: true },
      { id: "rf5", label: "Mijoz familyasi Sherzod K.", correct: false },
      { id: "rf6", label: "Pasport Toshkentda berilgan", correct: false },
    ],
    decisionOptions: [
      { id: "d1", label: "Hisob ochish", correct: false },
      { id: "d2", label: "Qo'shimcha verifikatsiya so'rash", correct: true },
      { id: "d3", label: "Compliance bo'limiga yuborish", correct: false },
      { id: "d4", label: "Operatsiyani rad etish", correct: false },
      { id: "d5", label: "Mijozni rad etish va politsiyaga xabar berish", correct: false },
    ],
    explanation:
      "Bir nechta vizual nomuvofiqlik — hujjat soxta bo'lishi ehtimoli yuqori, lekin qaror qabul qilishdan oldin asl hujjat va qo'shimcha tasdiqlovchi vositalar so'ralishi kerak.",
    recommendation:
      "Mijozdan asl hujjat, biometriya va qo'shimcha identifikatsiya so'rang. Qora ro'yxat bilan tekshiring.",
    previousBest: 72,
    initialStatus: "completed",
  },
  {
    id: "fs_deepfake_04",
    title: "Deepfake qo'ng'iroq",
    description:
      "Soxta ovoz yoki video qo'ng'iroq orqali firibgarlik urinishlarini aniqlang.",
    fraudType: "deepfake_call",
    difficulty: "advanced",
    riskLevel: "high",
    estimatedMinutes: 9,
    passScore: 70,
    averageScore: 58,
    attempts: 57,
    updatedAt: "2026-05-19",
    skills: ["Ovoz autentifikatsiyasi", "Sotsial muhandislik", "Eskalatsiya"],
    context:
      "Sizga 'CFO' nomidan shoshilinch o'tkazma talabi bilan qo'ng'iroq kelgan.",
    learnerRole: "Korporativ mijozlar bo'limi xodimi",
    task: "Qo'ng'iroq mazmunini diqqat bilan o'rganing va to'g'ri qaror qabul qiling.",
    evidence: {
      kind: "deepfake_call",
      callerName: "Bekzod R.",
      callerRole: "CFO (deklaratsiya bo'yicha)",
      transcript:
        "Salom, men hozir aeroportdaman. Tezroq 250 ming USD'ni quyidagi hisobga o'tkazib yuborish kerak — bu strategik bitim, lekin hech kim bilmasligi kerak. Tasdiqlashni o'zim keyin qilaman, hozir vaqt yo'q. Iltimos, tezroq.",
      urgency: "Juda yuqori — 'hozir, darhol'",
      requestedAction: "250 000 USD o'tkazma yangi (notanish) hisobga",
      suspiciousPhrases: [
        "'Hech kim bilmasligi kerak'",
        "'Tasdiqlashni o'zim keyin qilaman'",
        "'Hozir vaqt yo'q'",
        "Ovozda mexanik / robot ohang",
      ],
    },
    redFlagOptions: [
      { id: "rf1", label: "Shoshilinch va sirli talab", correct: true },
      { id: "rf2", label: "Standart tasdiqlash protokolini chetlab o'tish", correct: true },
      { id: "rf3", label: "Notanish destination hisob", correct: true },
      { id: "rf4", label: "Ovozda g'ayritabiiy mexanik ohang", correct: true },
      { id: "rf5", label: "CFO qo'ng'iroq qildi", correct: false },
      { id: "rf6", label: "Summa USD'da", correct: false },
    ],
    decisionOptions: [
      { id: "d1", label: "Operatsiyani tasdiqlash", correct: false },
      { id: "d2", label: "Operatsiyani rad etish", correct: false },
      {
        id: "d3",
        label: "Boshqa kanaldan CFO bilan to'g'ridan-to'g'ri bog'lanish va Compliance'ga xabar berish",
        correct: true,
      },
      { id: "d4", label: "Qo'shimcha SMS verifikatsiya so'rash", correct: false },
      { id: "d5", label: "Hamkasbiga maslahat so'rab so'ramoqdan o'tkazib yuborish", correct: false },
    ],
    explanation:
      "Deepfake CEO/CFO firibgarligi: shoshilinch, sirli va standartdan tashqari kanal. Hech qanday holatda ovozli qo'ng'iroq yagona tasdiqlovchi vosita bo'lmasligi kerak.",
    recommendation:
      "Doimo ikkinchi kanal orqali tasdiqlang (ofitsial telefon, ichki tizim). Hech qachon 'sirli operatsiya' so'roviga ergashmang.",
    initialStatus: "not_started",
  },
  {
    id: "fs_social_05",
    title: "Ijtimoiy muhandislik",
    description:
      "Psixologik usullar orqali ma'lumot olish urinishlarini aniqlang.",
    fraudType: "social_engineering",
    difficulty: "beginner",
    riskLevel: "medium",
    estimatedMinutes: 7,
    passScore: 70,
    averageScore: 81,
    attempts: 113,
    updatedAt: "2026-05-12",
    skills: ["Telefon protokoli", "Mijoz autentifikatsiyasi", "Pretextga qarshilik"],
    context:
      "Sizga 'IT bo'limidan' qo'ng'iroq kelgan, mijozning kartochka ma'lumotlarini darhol so'rashmoqda.",
    learnerRole: "Call-center operatori",
    task: "Qo'ng'iroq mazmunini tahlil qiling va to'g'ri javob bering.",
    evidence: {
      kind: "social_engineering",
      actorIdentity: "'Bek IT bo'limidan'",
      channel: "Ichki telefon, lekin tashqi raqamdan",
      requestedAction:
        "VIP mijozning karta raqami va CVV'ni og'zaki o'qib berishingiz",
      pressureTactic:
        "'Boshlig'ingiz menga aytdi, agar 5 daqiqada bermasangiz, sizni jazolaymiz'",
      policyHint:
        "Ichki politsiya: IT hech qachon CVV so'ramaydi va mijoz ma'lumotlarini telefon orqali o'qishni so'ramaydi.",
    },
    redFlagOptions: [
      { id: "rf1", label: "Standart politsiyaga zid talab (CVV)", correct: true },
      { id: "rf2", label: "Boshliq nomidan bosim", correct: true },
      { id: "rf3", label: "Tashqi raqamdan ichki qo'ng'iroq", correct: true },
      { id: "rf4", label: "Vaqt cheklash ('5 daqiqada')", correct: true },
      { id: "rf5", label: "Qo'ng'iroq qiluvchining ismi 'Bek'", correct: false },
      { id: "rf6", label: "Mijoz VIP", correct: false },
    ],
    decisionOptions: [
      { id: "d1", label: "Ma'lumotlarni berish", correct: false },
      {
        id: "d2",
        label: "Qo'ng'iroqni rad etish va xavfsizlik bo'limiga xabar berish",
        correct: true,
      },
      { id: "d3", label: "Boshliqqa qayta qo'ng'iroq qilish so'rash", correct: false },
      { id: "d4", label: "Faqat karta raqamini berish, CVV bermaslik", correct: false },
      { id: "d5", label: "Email orqali ma'lumotlarni yuborish", correct: false },
    ],
    explanation:
      "Klassik pretexting + authority bias. To'g'ri javob: doimiy protokolga rioya qilish va xavfsizlik bo'limiga xabar berish.",
    recommendation:
      "Hech qachon CVV / parol / OTP'ni og'zaki yoki yozma berib yubormang. Shubhali qo'ng'iroqlarni xavfsizlikka eskalatsiya qiling.",
    previousBest: 81,
    initialStatus: "completed",
  },
  {
    id: "fs_amlkyc_06",
    title: "AML/KYC red flag",
    description:
      "Pul yuvish va terrorizmni moliyalashtirish belgilarini aniqlang.",
    fraudType: "aml_kyc",
    difficulty: "advanced",
    riskLevel: "high",
    estimatedMinutes: 14,
    passScore: 70,
    averageScore: 66,
    attempts: 72,
    updatedAt: "2026-05-08",
    skills: ["AML tahlili", "Beneficial owner", "Tranzaksiya patterni"],
    context:
      "Yangi yuridik shaxs mijoz bankka kelgan va dastlabki operatsiyalar bir nechta signal bermoqda.",
    learnerRole: "AML compliance officer",
    task: "Profilni tahlil qiling va to'g'ri qaror qabul qiling.",
    evidence: {
      kind: "aml_kyc",
      businessType:
        "'Maslahatchilik va marketing' — aniq biznes faoliyati ko'rsatilmagan",
      sourceOfFunds: "Tasdiqlanmagan naqd pul mablag'i (180 000 USD)",
      transactionPattern:
        "Kichik bo'lakli ko'p o'tkazmalar (smurfing belgisi); turli yurisdiksiyalarga",
      beneficialOwner:
        "Rasmiy egasi 22 yoshli talaba, haqiqiy beneficial owner ko'rsatilmagan",
      riskIndicators: [
        "Nominee shareholder gumoni",
        "Yuqori riskli yurisdiksiya (FATF kulrang ro'yxati)",
        "Strukturalashtirilgan o'tkazmalar (smurfing)",
        "Naqd pul kelib chiqishi tasdiqlanmagan",
      ],
    },
    redFlagOptions: [
      { id: "rf1", label: "Beneficial owner aniq emas (nominee)", correct: true },
      { id: "rf2", label: "Naqd pul manbasi tasdiqlanmagan", correct: true },
      { id: "rf3", label: "Smurfing patterni", correct: true },
      { id: "rf4", label: "FATF kulrang ro'yxat yurisdiksiyasi", correct: true },
      { id: "rf5", label: "Mavhum biznes faoliyati", correct: true },
      { id: "rf6", label: "Yuridik shaxs Toshkentda ro'yxatdan o'tgan", correct: false },
      { id: "rf7", label: "Mijoz USD ishlatadi", correct: false },
    ],
    decisionOptions: [
      { id: "d1", label: "Hisob ochish va monitoringga olish", correct: false },
      { id: "d2", label: "Compliance bo'limiga yuborish va EDD boshlash", correct: true },
      { id: "d3", label: "Mijozni rad etish va politsiyaga xabar berish", correct: false },
      { id: "d4", label: "Qo'shimcha hujjat so'rab davom etish", correct: false },
      { id: "d5", label: "Ogohlantirishni e'tiborsiz qoldirish", correct: false },
    ],
    explanation:
      "Bir nechta yuqori-darajali AML signali. To'g'ri javob — Enhanced Due Diligence (EDD) jarayonini boshlash, hisobni ochmaslik.",
    recommendation:
      "EDD jarayonida beneficial owner, naqd pul manbasi va biznes asoslarini hujjat bilan tekshiring. Kerak bo'lsa STR yuboring.",
    previousBest: 55,
    initialStatus: "failed",
  },
];

// -------------------------- Learner stats -------------------------------
// Static numbers shown in the right sidebar. Wire to real progress when a
// real backend is available.
export const mockLearnerStats = {
  totalAttempts: 25,
  averageScore: 72,
  bestScore: 92,
  passedCount: 11,
  failedCount: 3,
} as const;

export type FraudAttemptRecord = {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  fraudType: FraudSimType;
  score: number;
  passed: boolean;
  detectedFlags: number;
  missedFlags: number;
  attemptedAt: string;
};

export const mockLearnerAttempts: ReadonlyArray<FraudAttemptRecord> = [
  {
    id: "att_1",
    scenarioId: "fs_document_03",
    scenarioTitle: "Soxta hujjat tekshiruvi",
    fraudType: "document",
    score: 85,
    passed: true,
    detectedFlags: 3,
    missedFlags: 1,
    attemptedAt: "2026-05-20",
  },
  {
    id: "att_2",
    scenarioId: "fs_social_05",
    scenarioTitle: "Ijtimoiy muhandislik",
    fraudType: "social_engineering",
    score: 92,
    passed: true,
    detectedFlags: 4,
    missedFlags: 0,
    attemptedAt: "2026-05-18",
  },
  {
    id: "att_3",
    scenarioId: "fs_amlkyc_06",
    scenarioTitle: "AML/KYC red flag",
    fraudType: "aml_kyc",
    score: 55,
    passed: false,
    detectedFlags: 2,
    missedFlags: 3,
    attemptedAt: "2026-05-15",
  },
  {
    id: "att_4",
    scenarioId: "fs_transaction_02",
    scenarioTitle: "Shubhali tranzaksiya",
    fraudType: "transaction",
    score: 58,
    passed: false,
    detectedFlags: 2,
    missedFlags: 2,
    attemptedAt: "2026-05-12",
  },
];
