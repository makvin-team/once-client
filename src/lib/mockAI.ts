// Mock AI engine for the Learner Assistant. Maps a user prompt to a canned
// response + citations from the knowledge base fixture. Replace with a real
// RAG client (POST /api/ai/chat) when the backend is wired in.
//
// Each rule looks at the lower-cased prompt for one or more keywords. The
// first matching rule wins. Responses cite documents from `data/mock.ts` so
// links in the chat resolve to real fixture rows.

import { mockDocuments } from "../data/mock";

export type Citation = {
  docId: string;
  title: string;
  section?: string;
};

export type AIResponse = {
  text: string;
  citations: Citation[];
  /** Optional follow-up questions the assistant suggests. */
  followUps?: ReadonlyArray<string>;
};

function findDoc(id: string) {
  return mockDocuments.find((d) => d.id === id);
}

function cite(docId: string, section?: string): Citation {
  const doc = findDoc(docId);
  return {
    docId,
    title: doc?.title ?? docId,
    section,
  };
}

type Rule = {
  keywords: ReadonlyArray<string>;
  build: () => AIResponse;
};

const RULES: ReadonlyArray<Rule> = [
  {
    keywords: ["aml", "anti-money", "anti money", "pul yuvish", "отмывание"],
    build: () => ({
      text:
        "AML reglamenti ko'ra, har bir mijoz operatsiyasini quyidagi red-flag'lar bo'yicha tekshirish kerak:\n\n1. Mijozning daromad manbasi noaniq bo'lgan katta naqd to'lov.\n2. Tez-tez kichik miqdorlar bilan amalga oshirilgan ortgan operatsiyalar.\n3. Hujjat va shaxs nomuvofiqligi (pasport, STIR, manzil).\n4. Mijozning savollardan qochishi yoki noaniq javoblari.\n5. Noodatiy geografik faollik (offshore yo'nalishlar).\n\nHar qanday shubhada compliance bo'limiga eskalatsiya qiling. Sizning rolingiz red-flag'larni TANISH, yakuniy qarorni esa compliance team qabul qiladi.",
      citations: [
        cite("doc_aml_reg", "2.1 Red flags"),
        cite("doc_kyc", "Mijoz tekshiruvi"),
      ],
      followUps: [
        "Compliance'ga qanday eskalatsiya qilish kerak?",
        "Daromad manbasini qanday isbotlash kerak?",
      ],
    }),
  },
  {
    keywords: ["kyc", "red flag", "red-flag", "verify", "tekshirish", "hujjat"],
    build: () => ({
      text:
        "Mijoz hujjatini tekshirish bo'yicha asosiy qadamlar:\n\n• Pasport raqami va seriya STIR ma'lumotlari bilan moslashganini tekshiring.\n• Pasport amal qilish muddati hozirgi sanaga nisbatan to'g'ri ekanini tasdiqlang.\n• Rasm va mijoz yuzini taqqoslang (oddiy biometric check).\n• Hujjat hech qanday o'zgartirish belgilarisiz ekanini ko'rib chiqing.\n• Hujjat skanida xolografik elementlar mavjudligini tekshiring.\n\nAgar bironta belgilar shubhali bo'lsa — operatsiyani to'xtating va supervisor'ga eskalatsiya qiling.",
      citations: [cite("doc_kyc", "Hujjat tekshiruvi")],
      followUps: [
        "Soxta hujjatni qanday aniqlash mumkin?",
        "Eskalatsiya qaysi bo'limga yuboriladi?",
      ],
    }),
  },
  {
    keywords: ["abs", "crm", "transfer", "workflow"],
    build: () => ({
      text:
        "ABS transfer workflow odatda quyidagi bosqichlardan iborat:\n\n1. Operator mijoz so'rovini qabul qiladi va ABS'da yangi operatsiya ochadi.\n2. Mijoz identifikatsiyasi avtomatik tekshiriladi.\n3. Hisob qoldig'i va limit cheklovlari validatsiya qilinadi.\n4. Compliance hook tomonidan tranzaksiya tahlil qilinadi.\n5. Tasdiq olingach, operatsiya bajariladi va kvitansiya chiqariladi.\n6. Mijozga SMS va ekran orqali natija ko'rsatiladi.\n\nHar bir bosqichdagi xatolik avtomatik qaytariladi va ABS interfeysida sabab ko'rsatiladi.",
      citations: [cite("doc_abs_manual", "Transfer flow")],
      followUps: ["ABS xatolik kodlari nimani anglatadi?"],
    }),
  },
  {
    keywords: ["phishing", "fraud", "deepfake", "social engineering"],
    build: () => ({
      text:
        "Phishing va social-engineering hujumlariga qarshi asosiy tamoyillar:\n\n• Hech qachon parol, OTP, PIN yoki CVV'ni telefon yoki email orqali so'ramang va bermang.\n• Yuboruvchi domeni rasmiy bank domeniga aniq mos kelishini tekshiring.\n• Shoshilinch ohangli email yoki qo'ng'iroqlarga shubha bilan yondashing.\n• Deepfake ovozli qo'ng'iroqda: takroriy savol bering, qayta qo'ng'iroq taklif qiling, identifikatsiyani so'rang.\n• Har qanday shubha tug'ilsa — compliance@bank.uz ga ogohlantirish yuboring.",
      citations: [cite("doc_aml_reg", "3.4 Social engineering")],
      followUps: [
        "Mijoz menga shubhali link yubordi, nima qilay?",
        "Deepfake belgilarini qanday aniqlayman?",
      ],
    }),
  },
  {
    keywords: ["dress", "etiket", "kiyim"],
    build: () => ({
      text:
        "Dress-code asosiy talablari:\n\n• Front-office xodimlari rasmiy business kiyimda bo'lishi shart (kostyum yoki kiyim-bosh va shim, ko'ylak).\n• Bank logosi badge har doim ko'rinarli bo'lishi kerak.\n• Sport kiyim, ochiq kiyim va shovqinli aksessuarlar taqiqlanadi.\n• Soch va tirnoq ozodaligi majburiy.\n\nIstisnolar (jamoa kuni, casual juma) HR bo'limining e'loni asosida belgilanadi.",
      citations: [cite("doc_dresscode")],
    }),
  },
  {
    keywords: ["vip", "escalation", "eskalatsiya", "narozi", "norozi"],
    build: () => ({
      text:
        "VIP mijoz murojaati uchun:\n\n• Mijozni darhol VIP-line'ga ulang yoki shaxsiy menejerga yo'naltiring.\n• Mijoz tushuntirgan har bir detalni ABS/CRM'ga qayd qiling.\n• Birinchi javob 5 daqiqa ichida kelishi kerak — ekspress SLA.\n• 30 daqiqada hal qilinmasa — branch manager'ga eskalatsiya qiling.\n• Yakunda mijozga rasmiy yozma tasdiq jo'nating.\n\nNorozi mijoz holatida: faol tinglash, empatiya bildirish va aniq yechim taklif qilish — uch asosiy qadam.",
      citations: [cite("doc_kyc", "VIP mijoz protokoli")],
    }),
  },
];

const FALLBACK: AIResponse = {
  text:
    "Savolingiz aniq mavzuga tegishli emas, lekin men bank ichki bilim bazasidagi ma'lumotlar asosida javob bera olaman.\n\nIltimos, savolni aniqroq shaklda qaytaring — masalan, qaysi reglament, jarayon yoki vaziyat bo'yicha javob kerakligini ko'rsating. Yoki pastdagi tavsiyalardan birini sinab ko'ring.",
  citations: [],
  followUps: [
    "AML red flag'lar ro'yxati",
    "ABS workflow",
    "Phishing belgilari",
  ],
};

export function mockAIRespond(prompt: string): AIResponse {
  const p = prompt.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((k) => p.includes(k))) return rule.build();
  }
  return FALLBACK;
}

// Pick a snappy title for a new session (first user message, trimmed).
export function titleFromPrompt(prompt: string): string {
  const cleaned = prompt.trim().replace(/\s+/g, " ");
  return cleaned.length > 48 ? cleaned.slice(0, 48) + "…" : cleaned;
}
