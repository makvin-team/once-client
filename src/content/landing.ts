// All landing copy lives here so localization can swap a single source.
// To add a new locale: duplicate this file as `landing.uz.ts` / `landing.ru.ts`
// matching the LandingContent type, then resolve by locale in pages/Home.tsx.

export type LandingContent = typeof landing;

export const landing = {
  meta: {
    title: "AI Mentor — AI-powered onboarding & training for bank employees",
    description:
      "AI Mentor: bank xodimlarini tezroq o'qitish, AI knowledge assistant, mock playground va fraud simulator. Train smarter. Reduce risk. Improve service.",
    ogImage: "/og.png",
    siteName: "AI Mentor",
  },
  nav: {
    links: [
      { label: "Problem", href: "#problem" },
      { label: "Features", href: "#features" },
      { label: "Business Value", href: "#value" },
      { label: "How it works", href: "#how" },
      { label: "Pilot", href: "#pilot" },
      { label: "FAQ", href: "#faq" },
    ],
    secondaryCta: "View Features",
    primaryCta: "Request Demo",
    primaryCtaHref: "#demo",
    secondaryCtaHref: "#features",
  },
  promo: {
    text: "Pilot programs open for Q3 2026 — limited bank slots.",
    badge: "REQUEST PILOT",
    href: "#demo",
  },
  hero: {
    eyebrow: "AI Mentor for banks",
    title: "AI-powered onboarding and training for bank employees.",
    titleHighlight: "AI-powered",
    subtitle:
      "Bank xodimlarini tezroq o'qiting, ichki hujjatlar bo'yicha AI yordam bering, real jarayonlarni xavfsiz simulator'da mashq qildiring va fraud risklarni kamaytiring.",
    primaryCta: "Request Demo",
    secondaryCta: "View Features",
    primaryCtaHref: "#demo",
    secondaryCtaHref: "#features",
    badges: [
      { tone: "yellow", label: "Faster onboarding" },
      { tone: "coral", label: "Lower HR workload" },
      { tone: "teal", label: "Fraud awareness" },
      { tone: "rose", label: "Skill analytics" },
    ] as const,
    mockup: {
      title: "AI Mentor · Operator Onboarding",
      stickyNotes: [
        { tone: "yellow", lines: ["Day 1", "AML basics"] },
        { tone: "coral", lines: ["Phishing", "scenario #04"] },
        { tone: "teal", lines: ["KYC", "red flags"] },
        { tone: "rose", lines: ["ABS", "transfer flow"] },
        { tone: "orange", lines: ["Skill gap", "Cards: 62%"] },
        { tone: "yellow", lines: ["Branch #14", "12/16 ready"] },
        { tone: "teal", lines: ["Mock client", "high-risk"] },
        { tone: "coral", lines: ["Deepfake", "voice call"] },
        { tone: "rose", lines: ["Compliance", "checkpoint"] },
        { tone: "orange", lines: ["KPI", "Q2 → +18%"] },
        { tone: "yellow", lines: ["Coaching", "1-on-1"] },
        { tone: "teal", lines: ["Sandbox", "10 scenarios"] },
      ],
    },
  },
  problem: {
    eyebrow: "The challenge",
    title: "Banks lose time and money on slow, inconsistent training.",
    subtitle:
      "Onboarding cycles drag on, internal knowledge is hard to find, and fraud risks grow when staff aren't prepared.",
    items: [
      {
        tone: "canvas",
        title: "Slow ramp-up",
        body: "Yangi xodimlar ichki jarayonlarga sekin moslashadi va ko'p haftalar yo'qotiladi.",
      },
      {
        tone: "yellow",
        title: "Lost in documents",
        body: "Xodimlar ichki hujjatlardan kerakli javobni tez topa olmaydi.",
      },
      {
        tone: "canvas",
        title: "Senior bottleneck",
        body: "Senior mutaxassislar takroriy savollarga kun bo'yi vaqt sarflaydi.",
      },
      {
        tone: "coral",
        title: "Real-system mistakes",
        body: "ABS / CRM ni jonli muhitda o'rganish operatsion xatolarga olib keladi.",
      },
      {
        tone: "canvas",
        title: "Reputation risk",
        body: "Mijoz bilan ishlashdagi xatolar bank obro'siga ta'sir qiladi.",
      },
      {
        tone: "rose",
        title: "Fraud blind-spot",
        body: "Fraud holatlarini vaqtida aniqlamaslik moliyaviy va compliance risklarni oshiradi.",
      },
      {
        tone: "canvas",
        title: "No skill visibility",
        body: "HR va o'quv markazi xodimlarda kim nimani bilishini aniq ko'ra olmaydi.",
      },
    ] as const,
  },
  solution: {
    eyebrow: "The solution",
    title: "One platform. From day-one knowledge to day-90 mastery.",
    body: "AI Mentor bank xodimlari uchun AI knowledge base, role-based learning plan, mock playground, fraud simulator, progress tracking va HR analytics'ni bitta platformada birlashtiradi.",
    items: [
      {
        title: "AI knowledge",
        body: "AI yordamchi ichki hujjatlar bo'yicha savollarga manba bilan javob beradi.",
      },
      {
        title: "Role-based path",
        body: "Xodim lavozimiga qarab o'quv reja avtomatik shakllanadi.",
      },
      {
        title: "Safe practice",
        body: "Bank jarayonlari mock playground'da xavfsiz mashq qilinadi.",
      },
      {
        title: "Fraud simulator",
        body: "Fraud scenario'lar orqali xodimlar xavfni oldindan tanishga o'rganadi.",
      },
      {
        title: "HR dashboard",
        body: "Progress va zaif skill'lar bitta dashboard'da real vaqtda ko'rinadi.",
      },
    ] as const,
  },
  features: {
    eyebrow: "Core features",
    title: "Everything a bank needs to train modern operators.",
    subtitle:
      "From AI Q&A on internal regulations to fraud simulation and HR analytics — six modules, one workspace.",
    items: [
      {
        tone: "yellow",
        badge: "AI assistant",
        title: "AI Knowledge Assistant",
        body: "Ichki hujjatlar bo'yicha tez savol-javob, manba ko'rsatish bilan.",
        bullets: [
          "Reglament, FAQ, dress-code va jarayonlar bo'yicha yordam",
          "Javob manbasini ko'rsatish",
          "O'zbek va rus tillarini qo'llab-quvvatlash",
        ],
      },
      {
        tone: "coral",
        badge: "Learning",
        title: "Role-based Learning Plan",
        body: "Lavozim va mas'uliyatga qarab moslashadigan o'quv yo'li.",
        bullets: [
          "Skill xaritasi va bosqichma-bosqich training",
          "O'zlashtirish prognozi",
          "Avtomatik moslashtirish",
        ],
      },
      {
        tone: "teal",
        badge: "Practice",
        title: "Mock Playground",
        body: "Bank jarayonlarini realga o'xshash muhitda mashq qilish.",
        bullets: [
          "Virtual mijoz scenario'lari",
          "ABS / CRM workflow'lar dummy data bilan",
          "Xatolar bo'yicha aniq feedback",
        ],
      },
      {
        tone: "rose",
        badge: "Risk",
        title: "Anti-Fraud Simulator",
        body: "Phishing, suspicious transaction, deepfake va social engineering.",
        bullets: [
          "6+ fraud scenario familiyalari",
          "Adaptive difficulty",
          "Fraud-awareness score",
        ],
      },
      {
        tone: "canvas",
        badge: "Analytics",
        title: "Progress & Skill Analytics",
        body: "Xodim, filial va bo'lim kesimida real ko'rinish.",
        bullets: [
          "Skill gap visualization",
          "Training recommendation",
          "Branch-level analytics",
        ],
      },
      {
        tone: "canvas",
        badge: "Integration",
        title: "LMS Integration",
        body: "Training natijalarini LMS / iSpring tizimiga uzatish.",
        bullets: [
          "Score va completion status",
          "O'quv tarixini kuzatish",
          "Standard SCORM / xAPI export",
        ],
      },
    ] as const,
  },
  fraud: {
    eyebrow: "Fraud & risk reduction",
    title: "Train your front line against real-world fraud — safely.",
    subtitle:
      "Banks for whom risk reduction is a measurable business outcome. AI Mentor generates realistic scenarios, scores decisions, and explains every miss.",
    scenarios: [
      { tone: "coral", title: "Phishing email", body: "Aniq yoki shubhali emailni tanish." },
      { tone: "yellow", title: "Suspicious transaction", body: "Tranzaksiyani tezda baholash." },
      { tone: "teal", title: "Fake document", body: "Soxta hujjatdagi belgilar topish." },
      { tone: "rose", title: "Deepfake call", body: "Voice fraud holatini aniqlash." },
      { tone: "orange", title: "Social engineering", body: "Bosim ostida to'g'ri qaror." },
      { tone: "canvas", title: "AML / KYC red flags", body: "Compliance signallarini tanish." },
    ] as const,
    aiCapabilities: [
      "Realistik scenario yaratadi",
      "Xodim qarorini baholaydi",
      "Xato sababini tushuntiradi",
      "O'tkazib yuborilgan red-flag'larni ko'rsatadi",
      "Difficulty level'ni xodimga moslashtiradi",
      "Fraud-awareness score chiqaradi",
    ] as const,
  },
  businessValue: {
    eyebrow: "Business value",
    title: "Train smarter. Reduce risk. Improve service.",
    subtitle:
      "AI Mentor banklarga xodimlarni tezroq, xavfsizroq va o'lchanadigan tarzda o'qitishga yordam beradi.",
    stats: [
      { value: "-40%", label: "Onboarding vaqti" },
      { value: "-30%", label: "Senior workload" },
      { value: "+62%", label: "Fraud awareness" },
      { value: "1×", label: "Standard har filialda" },
    ],
    items: [
      "Onboarding vaqtini qisqartirish",
      "Senior va HR xodimlar vaqtini tejash",
      "Training xarajatlarini optimallashtirish",
      "Xizmat ko'rsatish xatolarini kamaytirish",
      "Fraud va compliance risklarni kamaytirish",
      "Xodim productivity'sini oshirish",
      "Filiallar bo'yicha bir xil training standard yaratish",
      "Rahbariyat uchun aniq skill analytics berish",
    ] as const,
  },
  howItWorks: {
    eyebrow: "How it works",
    title: "From upload to outcome in four steps.",
    steps: [
      {
        step: "01",
        title: "Upload knowledge",
        body: "Bank reglamentlari, FAQ, training materiallari va ichki yo'riqnomalar tizimga yuklanadi.",
      },
      {
        step: "02",
        title: "Create learning paths",
        body: "Xodim lavozimi va mas'uliyatiga qarab o'quv reja shakllanadi.",
      },
      {
        step: "03",
        title: "Practice in simulator",
        body: "Xodim virtual mijoz, bank workflow va fraud scenario'larda mashq qiladi.",
      },
      {
        step: "04",
        title: "Track and improve",
        body: "Tizim progress, score, skill gap va tavsiyalarni HR dashboard'da ko'rsatadi.",
      },
    ] as const,
  },
  targetUsers: {
    eyebrow: "Target users",
    title: "Built for every role that touches operator readiness.",
    primary: [
      {
        tone: "yellow",
        title: "HR teams",
        body: "Onboarding va progress tracking'ni avtomatlashtiradi.",
      },
      {
        tone: "coral",
        title: "Branch managers",
        body: "Filial xodimlari tayyorgarligini bitta dashboard'da ko'radi.",
      },
      {
        tone: "teal",
        title: "Compliance teams",
        body: "Fraud awareness va risk training'ni kuchaytiradi.",
      },
      {
        tone: "rose",
        title: "Employees",
        body: "Savollarga tez javob oladi va real vaziyatlarni xavfsiz mashq qiladi.",
      },
    ] as const,
    extras: [
      "O'quv markazlari",
      "Front-office xodimlari",
      "Call-center xodimlari",
      "Yangi ishga qabul qilingan xodimlar",
      "Amaliyotchilar va trainee dasturlari",
    ],
  },
  pilot: {
    eyebrow: "MVP / Pilot",
    title: "Your first pilot — scoped to prove value in weeks, not quarters.",
    scope: {
      title: "Pilot scope",
      items: [
        "1 ta AI knowledge base",
        "1 ta lavozim bo'yicha learning plan",
        "1 ta mock banking workflow",
        "3 ta fraud scenario",
        "Progress dashboard",
        "Demo / pilot report",
      ] as const,
    },
    outcomes: {
      title: "What you'll measure",
      items: [
        "Onboarding vaqtini o'lchash",
        "Xodim javob sifati va progress",
        "Fraud awareness score",
        "HR / senior workload kamayishi",
        "Keyingi bosqich uchun recommendation",
      ] as const,
    },
    cta: "Request a pilot plan",
  },
  demo: {
    eyebrow: "Request demo",
    title: "See AI Mentor inside your bank context.",
    subtitle:
      "Formani to'ldiring — jamoamiz 1 ish kuni ichida bog'lanadi va sizning use-case'ingiz uchun moslashtirilgan demo tashkil qiladi.",
    fields: {
      fullName: { label: "Full name", placeholder: "Ism Familiya" },
      companyName: { label: "Company / Bank name", placeholder: "Bank nomi" },
      jobTitle: { label: "Job title", placeholder: "Head of HR / CRO / ..." },
      email: { label: "Work email", placeholder: "name@bank.uz" },
      phone: { label: "Phone number", placeholder: "+998 90 000 00 00" },
      interestedModule: {
        label: "Interested module",
        options: [
          "AI Knowledge Assistant",
          "Employee Training",
          "Fraud Simulator",
          "Skill Analytics",
          "Full Platform",
        ],
      },
      message: { label: "Message", placeholder: "Tell us about your team & goals" },
    },
    submit: "Request Demo",
    submitting: "Sending…",
    success: "Thank you. Our team will contact you shortly to schedule a demo.",
    errors: {
      required: "This field is required.",
      email: "Please enter a valid work email.",
      phone: "Please enter a valid phone number.",
      submit: "Couldn't send the request. Please try again in a moment.",
      timeout: "The request timed out. Check your connection and retry.",
      duplicate: "We already received your request — we'll be in touch.",
    },
  },
  faq: {
    eyebrow: "FAQ",
    title: "Common questions",
    items: [
      {
        q: "AI Mentor real mijoz ma'lumotlari bilan ishlaydimi?",
        a: "Yo'q. Platforma real mijoz bazasiga ulanmaydi. Simulator faqat dummy yoki synthetic data bilan ishlaydi.",
      },
      {
        q: "Platforma bank ichki hujjatlaridan javob bera oladimi?",
        a: "Ha. Ichki reglament, FAQ va training materiallari asosida AI yordamchi savollarga javob beradi.",
      },
      {
        q: "Bu LMS yoki iSpring o'rnini bosadimi?",
        a: "Yo'q. Platforma LMS bilan integratsiya qilinadi va training natijalarini mavjud tizimlarga yuborishi mumkin.",
      },
      {
        q: "Fraud simulator nima qiladi?",
        a: "Xodimlarga phishing, shubhali tranzaksiya, soxta hujjat, deepfake call va social engineering kabi holatlarni mashq qildiradi.",
      },
      {
        q: "Pilot qancha scope'da bo'ladi?",
        a: "Birinchi pilotda bitta knowledge base, bitta learning plan, bitta mock process va bir nechta fraud scenario bo'lishi mumkin.",
      },
    ] as const,
  },
  footer: {
    tagline:
      "AI-powered onboarding & training platform for bank employees. Train smarter. Reduce risk. Improve service.",
    columns: [
      {
        title: "Product",
        links: [
          { label: "Problem", href: "#problem" },
          { label: "Features", href: "#features" },
          { label: "Business Value", href: "#value" },
          { label: "How it works", href: "#how" },
        ],
      },
      {
        title: "Get started",
        links: [
          { label: "Request Demo", href: "#demo" },
          { label: "Pilot plan", href: "#pilot" },
          { label: "FAQ", href: "#faq" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "#" },
          { label: "Privacy policy", href: "#" },
          { label: "Security", href: "#" },
        ],
      },
    ],
    contactLabel: "Contact",
    contactEmail: "hello@aimentor.uz",
    privacy: "Privacy policy",
    copyright: "© 2026 AI Mentor Labs. All rights reserved.",
  },
} as const;
