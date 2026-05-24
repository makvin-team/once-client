import type { TheoryDictionary } from "../../theoryCourse";

export const theoryCourseUz: TheoryDictionary = {
  ui: {
    eyebrow: "Nazariya rejimi",
    pageTitle: "Veb kurs",
    pageDescription:
      "3D Simulyatorga hamroh bo'lgan o'qish uchun mo'ljallangan kurs. Simulyatorda mashq qiladigan har bir stsenariyga shu yerda nazariy dars to'g'ri keladi — avval o'qing yoki keyin takrorlash uchun foydalaning.",
    pillarLabel: "Yo'nalish",
    modulesCount: (n, minutes) => `${n} ta modul · ${minutes} daq`,
    open: "Ochish",
    breadcrumbRoot: "Veb kurs",
    pillarSubtitleLine: (priority, subtitle) =>
      `Yo'nalish ${priority} · ${subtitle}`,
    read: "O'qish",
    moduleMeta: (minutes, indicators) =>
      `${minutes} daq o'qish · ${indicators} ko'rsatkich · 1 qaror`,
    aboutPillar: "Ushbu yo'nalish haqida",
    pillarSummary: (title, count) => `${title} · ${count} ta modul`,
    aboutPillarLessons: (n) => `${n} ta nazariy dars`,
    aboutPillarMinutes: (m) => `Jami ~${m} daqiqa`,
    aboutPillarMaps: "Har bir dars simulyator stsenariysiga mos keladi",
    aboutPillarFooter:
      "Nazariyani o'qing, so'ngra 3D Simulyatorda xuddi shu stsenariyni ochib, qarorni vaqt bosimi ostida mashq qiling.",
    pillarNotFoundTitle: "Yo'nalish topilmadi",
    pillarNotFoundDescription: "So'ralgan yo'nalish mavjud emas.",
    backToPillars: "Barcha yo'nalishlarga qaytish",
    moduleEyebrow: (pillar, minutes) => `${pillar} · ${minutes} daq o'qish`,
    learningObjective: "O'qish maqsadi",
    sectionOverview: "Umumiy ko'rinish",
    sectionIndicators: "Kuzatish kerak bo'lgan ko'rsatkichlar",
    sectionDecision: "Qaror",
    sectionTakeaways: "Asosiy xulosalar",
    sectionReferences: "Manbalar",
    severity: {
      critical: "KRITIK",
      high: "YUQORI",
      medium: "O'RTA",
      low: "PAST",
    },
    decisionCorrect: "To'g'ri",
    decisionPartial: "Qisman",
    decisionFail: "Xato",
    pointsLabel: (n) => `${n} ball`,
    previousModule: "← Oldingi modul",
    nextModule: "Keyingi modul →",
    allPillarModules: (pillar) => `${pillar} ning barcha modullari`,
    lessonNotFoundTitle: "Dars topilmadi",
    lessonNotFoundDescription: "So'ralgan nazariy dars mavjud emas.",
  },
  pillars: {
    aml: {
      title: "AML",
      subtitle: "Pul yuvishga qarshi kurash",
      description:
        "Pul yuvish patternlarini aniqlash va ularga javob berish: tuzilgan naqd pul, benefitsiar shaffofligi, sanksiya tushishi, PEP riski va foydali SAR yozish ko'nikmasi.",
    },
    cyber: {
      title: "Kiberxavfsizlik",
      subtitle: "Kibernetik himoya",
      description:
        "Phishing, alertlar va insidentlarni SOC jamoalari produksiyada ishlatadigan playbook'lar bilan triaj qiling. Zero-Trust fikrlash va zamonaviy social engineering himoyasi.",
    },
    fraud: {
      title: "Firibgarlik",
      subtitle: "Firibgarlikni aniqlash va javob berish",
      description:
        "Mule hisoblari, sintetik shaxslar, karta skimming va do'stona firibgarlikni aniqlang — hamda ularni mijoz tajribasini buzmasdan tutib oluvchi AI modellarni sozlang.",
    },
    cx: {
      title: "Mijoz tajribasi",
      subtitle: "CX — mijoz xizmati",
      description:
        "Tasdiqlash, muloqot va eskalatsiyani kamaytirish. Compliance ustunlariga shaxslararo to'ldiruvchi: nazoratni munosabatlarni yo'qotmasdan qo'llash usuli.",
    },
  },
  modules: {
    "aml-m1": {
      title: "Shubhali tranzaksiya · CTR / SAR",
      subtitle: "Naqd to'lov, strukturalash va SAR qarori",
      objective:
        "Strukturalangan naqd to'lov red flag'larini aniqlang va mijozga oshkor qilmasdan to'g'ri xabar berish harakatini tanlang.",
      overview:
        "Filialga kelgan mijoz xabar berish chegarasi ostida turgan summa, toza mayda kupyuralarda, manbasi noaniq holda kiritadi. Operator Shubhali Faollik Hisoboti (SAR) berishi, eskalatsiya qilishi, tranzaksiyani ochishi yoki — eng yomoni — siyosatni mijozga tushuntirishini hal qilishi kerak. Ushbu modul strukturalashning huquqiy ta'rifi, CTR chegarasi, SAR berish oynasi va oshkor qilmaslik qoidasini qamrab oladi.",
      indicators: [
        {
          label: "Summa chegarasi ostida",
          detail:
            "187M so'm depoziti 200M CTR chegarasidan ~7% past. Strukturalash niyatdan qat'i nazar federal darajadagi jinoyatdir.",
          severity: "critical",
        },
        {
          label: "Naqd manba tasdiqlanmagan",
          detail:
            "Mijoz pul qaerdan kelganini hujjatlashtirolmaydi yoki hujjatlashtirmaydi. 50M so'mdan oshgan har qanday naqd tranzaksiya uchun manba majburiy.",
          severity: "critical",
        },
        {
          label: "Risk balli ko'tarilgan (74)",
          detail:
            "Mijozning xulq-atvor risk balli o'tgan oyda bankning 70-balllik chegarasidan o'tdi va ko'rib chiqilmagan.",
          severity: "high",
        },
        {
          label: "Chegara-aro davomi (UZ → AE)",
          detail:
            "Mablag'lar 24 soat ichida AE korporativ hisobiga o'tkaziladi — klassik layering namunasi.",
          severity: "medium",
        },
      ],
      correctAction: {
        label: "3 ish kuni ichida SAR yuborish",
        rationale:
          "SAR yuborish — yagona qonuniy yo'l. Bu shubhani hujjatlashtiradi, audit izini muzlatadi va bank hamda operatorni ikkilamchi javobgarlikdan himoya qiladi. Mijozga xabar berilmaydi.",
      },
      partialAction: {
        label: "Compliance bo'limiga ko'rib chiqish uchun eskalatsiya",
        rationale:
          "Hech narsadan ko'ra yaxshiroq — ikkinchi ko'z beradi — lekin SAR vaqti ketmoqda. Buni faqat namuna mos kelishiga haqiqatan shubha qilganingizda foydalaning, yuborishdan qochish uchun emas.",
      },
      failAction: {
        label: "Tranzaksiyani ochish yoki mijozni ogohlantirish",
        rationale:
          "Ochish dalillar zanjirini yo'q qiladi. Ogohlantirish (mijozga SAR yuborilayotganini aytish) AML qonuni bo'yicha alohida jinoiy huquqbuzarlik — operator uchun shaxsiy javobgarlik keltiradi.",
      },
      takeaways: [
        "Strukturalash asosiy jinoyat isbotlanmasa ham noqonuniy.",
        "SAR shubha tug'ilgandan keyin 3 ish kuni ichida yuborilishi shart.",
        "Mijozga SAR yuborilayotganini hech qachon oshkor qilmang — bu jinoyat.",
        "Naqd chegarasi ustida manbani hujjatlashtirish majburiy.",
      ],
      references: [
        "FATF Tavsiyasi 20 — Shubhali tranzaksiyalar haqida xabar berish",
        "O'zbekiston MB AML/CFT Reglamenti 2.4",
      ],
    },
    "aml-m2": {
      title: "Chuqurlashtirilgan KYC · benefitsiar",
      subtitle: "Shell egaligi yuzasidagi korporativ niqobni ko'tarish",
      objective:
        "Korporativ tuzilma UBO tekshiruvini talab qiladigan vaqtni aniqlang va zanjir tozalanmaguncha onboarding'dan voz keching.",
      overview:
        "Yangi korporativ hisob arizasida nomzod direktor va yashirinlik darajasi yuqori bo'lgan yurisdiktsiyada ro'yxatdan o'tgan ona kompaniya ko'rsatilgan. FATF tuzilmadan o'tib, oxir-oqibat 25% yoki undan ko'p ulushga ega yoki nazorat qiluvchi jismoniy shaxsni aniqlashni talab qiladi. Ushbu modul huquqiy chegara, qabul qilinadigan dalillar va onboarding'dan qachon voz kechish kerakligini qamrab oladi.",
      indicators: [
        {
          label: "Nomzod direktor faylda",
          detail:
            "Direktor — professional xizmat ko'rsatuvchi, haqiqiy egasi emas. Qonuniy trust tuzilmalarida ham uchraydi, lekin shell-kompaniyaning №1 alomati.",
          severity: "high",
        },
        {
          label: "Ona kompaniya yashirin yurisdiktsiyada",
          detail:
            "Ona kompaniya FATF kulrang ro'yxatidagi yurisdiktsiyada ro'yxatdan o'tgan va benefitsiar ochiq reestrisiz.",
          severity: "critical",
        },
        {
          label: "Egalik zanjiri 3 qatlamdan ortiq",
          detail:
            "Har bir qo'shimcha qatlam shaffofsizlikni oshiradi. 3 qatlamdan yuqori — isbot yuki mijozga o'tadi.",
          severity: "high",
        },
      ],
      correctAction: {
        label: "UBO hujjatlashtirilmaguncha onboarding'ni rad etish",
        rationale:
          "25% qoidasi muzokaraga bo'ysunmaydi. Tekshirilgan jismoniy-shaxs UBO'siz hisob ochilmaydi — nuqta. Rad etishni hujjatlang va compliance'ga xabar bering.",
      },
      partialAction: {
        label: "UBO kutilayotganda cheklangan limitlar bilan ochish",
        rationale:
          "Ba'zi banklar past riskli korporatlarda buni ruxsat etadi, lekin bu riskni tasdiqlovchi operatorga o'tkazadi. Faqat compliance UBO tuzatish oynasini oldindan tasdiqlagan bo'lsa qabul qilinadi.",
      },
      failAction: {
        label: "Faqat nomzodning imzosi bilan hisob ochish",
        rationale:
          "Bu shell-kompaniyalar bank tizimiga kiradigan darslik usuli. Bank keyin noma'lum UBO hisobda nima qilsa shunga javob beradi.",
      },
      takeaways: [
        "UBO chegarasi — to'g'ridan-to'g'ri yoki bilvosita 25% egalik/nazorat.",
        "Nomzod tuzilmalar — sariq bayroq; nomzod + yashirin yurisdiktsiya — qizil.",
        "'Yurist keyinroq yuboradi' qabul qilinmaydi — UBO hujjatlari onboardingdan oldin.",
        "Rad etish sababini hujjatlang; rad etishlar ham audit qilinadi.",
      ],
      references: ["FATF Tavsiyasi 24 — Yuridik shaxslarning shaffofligi"],
    },
    "aml-m3": {
      title: "Sanksiya skrining · OFAC / UN",
      subtitle: "Ism mosligi, fuzzy tushishlar va muzlatish qarori",
      objective:
        "Sanksiya skrining tushishini triaj qiling va bloklash, eskalatsiya qilish yoki noto'g'ri ijobiy sifatida tozalashni hal qiling.",
      overview:
        "Sanksiyalangan yurisdiktsiyadagi beneficiarga o'tkazma OFAC SDN ro'yxatiga qarshi fuzzy-match ogohlantirishini keltirib chiqaradi. Mos kelish bali 82% — bankning avtomatik ko'rib chiqish chegarasi ustida lekin avtomatik blok chizig'idan past. Ushbu modul OFAC, UN va EU sanksiyalari, 50-foiz qoidasi va tushishni tozalash uchun yetarli dalil nimaligini qamrab oladi.",
      indicators: [
        {
          label: "Fuzzy match bali 82%",
          detail:
            "Ism — ro'yxatdagi shaxs transliteratsiya varianti. Bir xil tug'ilgan kun oralig'i, boshqa o'rtacha bosh harf.",
          severity: "critical",
        },
        {
          label: "Beneficiar yurisdiktsiyasi to'liq sanksiyalangan",
          detail:
            "Davlat darajasidagi OFAC dasturi maxsus litsenziyasiz barcha tranzaksiyalarni bloklaydi.",
          severity: "critical",
        },
        {
          label: "Yuboruvchining shoshilishi",
          detail:
            "Mijoz o'sha kuni amalga oshirishni talab qiladi va bankni tovon bilan ta'minlashni taklif qiladi. Bosim o'zi red flag.",
          severity: "high",
        },
      ],
      correctAction: {
        label: "O'tkazmani bloklash va OFAC hisobotini yuborish",
        rationale:
          "Bunday baldagi fuzzy tushish va to'liq sanksiyalangan yurisdiktsiya — majburiy blok. Bank niyatdan qat'i nazar 10 ish kuni ichida hisobot yuborishi shart.",
      },
      partialAction: {
        label: "Ushlab turish va sanksiya stoliga eskalatsiya",
        rationale:
          "Mos kelish bali chegarada va yurisdiktsiya to'liq emas bo'lsa qabul qilinadi. O'tkazma tozalanmaguncha hali ochilmaydi.",
      },
      failAction: {
        label: "Mijoz tovoniga asosan ochish",
        rationale:
          "Mijoz tovonlari OFAC jarimalariga qarshi qiymatsiz. Bank qat'iy javobgarlikni ko'taradi — fuqarolik jarimalari tranzaksiya qiymati plyus 2x ga yetishi mumkin.",
      },
      takeaways: [
        "Sanksiya javobgarligi qat'iy — niyat ahamiyatsiz.",
        "50-foiz qoidasi: sanksiyalangan shaxslarga ≥50% tegishli yuridik shaxslar ham sanksiyalangan, hatto ro'yxatda bo'lmasa ham.",
        "Hech qachon tushishni tozalash o'rniga tovon qabul qilmang.",
        "Noto'g'ri ijobiy tozalashlarni ishlatilgan dalil bilan hujjatlang.",
      ],
      references: ["OFAC SDN ro'yxati", "UN Xavfsizlik Kengashi konsolidatsiyalangan ro'yxati"],
    },
    "aml-m4": {
      title: "PEP riski · siyosiy ahamiyatli shaxslar",
      subtitle: "Siyosiy ahamiyatli mijozlar uchun chuqurlashtirilgan due diligence",
      objective:
        "Siyosiy ahamiyatli shaxsga (PEP) chuqurlashtirilgan due diligence (EDD) qo'llang va oila yoki yaqinlar orqali bilvosita PEP ta'sirini aniqlang.",
      overview:
        "Yangi private banking mijozi amaldagi vazir o'rinbosarining katta o'g'li ekanligi ma'lum bo'ldi. U PEP emas, lekin Yaqin Qarindosh va Sherik (RCA) — bu FATF bo'yicha asosiy PEP bilan bir xil EDD majburiyatini olib keladi. Ushbu modul PEP/RCA ta'riflari, sobiq PEP'lar uchun 12 oylik retrospektiv va katta menejment ruxsatining talabini qamrab oladi.",
      indicators: [
        {
          label: "Davlat amaldoriga oilaviy aloqa",
          detail:
            "RCA holati har qanday PEP — ichki, xorijiy yoki xalqaro tashkilot — yaqin oilasiga taalluqlidir.",
          severity: "high",
        },
        {
          label: "Boylik e'lon qilingan kasb bilan mos kelmaydi",
          detail:
            "Yiliga $40k daromad $2M depozitni tushuntirmaydi. Boylik manbai (faqat mablag' manbai emas) talab qilinadi.",
          severity: "critical",
        },
        {
          label: "Hisob maqsadi noaniq",
          detail:
            "'Investitsiyalar' — investitsiya rejasi yo'q, manzili yo'q, vaqt ufqi yo'q. PEP'lar hujjatlashtirilgan hisob-maqsad bayonotini talab qiladi.",
          severity: "medium",
        },
      ],
      correctAction: {
        label: "Katta menejment ruxsati bilan EDD qo'llash",
        rationale:
          "PEP/RCA onboardingi boylik manbai tekshiruvi, doimiy chuqurlashtirilgan monitoring va katta xodimning aniq ruxsatini talab qiladi (faqat compliance emas).",
      },
      partialAction: {
        label: "Standart onboarding va keyingi yangilanish davrida ko'rib chiqish",
        rationale:
          "Mohiyatni o'tkazib yuboradi — EDD onboarding'da, keyingi davriy ko'rib chiqishda emas, qo'llanilishi kerak. Faqat RCA aloqasi onboardingdan keyin topilganligi haqida hujjatlangan dalil bo'lsa qabul qilinadi.",
      },
      failAction: {
        label: "PEP munosabatini belgilamasdan onboard qilish",
        rationale:
          "PEP munosabatini yashirish yoki topa olmaslik — AML xodimlariga shaxsiy sanksiyalarning eng keng tarqalgan sabablaridan biri. Audit izi bilinishi mumkin bo'lgan narsalarni ko'rsatadi.",
      },
      takeaways: [
        "PEP holati oila va yaqin sheriklarga (RCA) ham tegishli.",
        "PEP holati amaldor lavozimni tark etgandan keyin 12 oy davom etadi.",
        "EDD mablag' manbaini emas, boylik manbaini talab qiladi.",
        "PEP onboardingiga faqat compliance emas, katta menejment ruxsat berishi kerak.",
      ],
      references: ["FATF Tavsiyasi 12 — PEP'lar"],
    },
    "aml-m5": {
      title: "Shubhali Faollik Hisobotini yozish",
      subtitle: "Hikoya intizomi, faktlar va xulosalar va 5 W",
      objective:
        "Faktik, to'liq va Moliyaviy Razvedka Birligi (FIU) uchun foydali SAR hikoyasini tuzing.",
      overview:
        "Noaniq SAR (\"Mijoz asabiy ko'rindi\") hech qanday SAR'dan yomonroq — bu FIU tahlilchilarining vaqtini behuda sarflaydi va bankni hisobot sifati topilmasiga duchor qiladi. Ushbu modul amaliy yozish ustaxonasi: hikoyani 5 W atrofida qanday tuzish, qachon skrinshotlarni qo'shish va kuzatilgan faktlarni xulosa qilingan xulosalardan qanday ajratish.",
      indicators: [
        {
          label: "Hikoya 'Nima uchun shubhali'ni qoldiradi",
          detail:
            "FIU tahlilchilari kuniga yuzlab SAR'ni triaj qiladi. Aniq shubha xatboshisiz SAR arxivlanadi.",
          severity: "high",
        },
        {
          label: "Faktlar va xulosalar aralashgan",
          detail:
            "'Mijoz pul yuvayapti' kabi bayonotlar — xulosalar. 'Mijoz Y kunda X miqdor kiritdi; manba tekshirilmadi' bilan almashtiring.",
          severity: "high",
        },
        {
          label: "Yordamchi hujjatlar yo'q",
          detail:
            "Tranzaksiya skrinshotlari, KYC nomuvofiqliklari va ko'rib chiqishni boshlagan ogohlantirish biriktirilishi kerak.",
          severity: "medium",
        },
      ],
      correctAction: {
        label: "5W tuzilmasini ishlating: Kim / Nima / Qaerda / Qachon / Nima uchun-shubhali",
        rationale:
          "Har bir bo'lim — vaqt belgili fakt bayonoti. 'Nima uchun shubhali' oxirgi xatboshi va faktlarni tipologiya (strukturalash, layering, mule, va h.k.) bilan bog'laydi.",
      },
      partialAction: {
        label: "Shabonni kichik tahrirlar bilan yuborish",
        rationale:
          "Shablonlar yuborishni tezlashtiradi lekin umumiy hikoyalar FIU tomonidan past sifatli sifatida belgilanadi. Shablonni faqat skaffold sifatida ishlating.",
      },
      failAction: {
        label: "Faqat ichki tuyg'uga asosan hikoya yuborish",
        rationale:
          "Yordamchi faktlarsiz subyektiv bayonotlar hisobot keyinroq sud jarayonida oshkor qilingan yurisdiktsiyalarda tuhmat sifatida qaralishi mumkin.",
      },
      takeaways: [
        "Faktlardan boshlang; tipologiya bilan tugating.",
        "Har doim ishga tushiruvchi ogohlantirish va KYC snapshotini biriktiring.",
        "'Shubhali', 'g'alati', 'asabiy' kabi sifatlardan saqlaning — kuzatilgan xulq-atvordan foydalaning.",
        "SAR'ni go'yo siz uni sovuq holda ko'rgan FIU tahlilchisidek qayta o'qing.",
      ],
    },
    "cyber-m1": {
      title: "Phishing triaj · domen tahlili",
      subtitle: "Yuboruvchi, shoshilish, havola — uch soniyalik test",
      objective:
        "Yuboruvchi domeni, shoshilish tili va havola hover'i orqali phishing emailni 10 soniyadan kam vaqtda aniqlang.",
      overview:
        "Email 'IT Xavfsizlik'dan keladi va hisob bloklanishidan oldin maxfiy ma'lumotlarni tasdiqlashni so'raydi. Yuboruvchi ekran nomi mos keladi lekin asosiy domen — taqlid. Ushbu modul texnik bo'lmagan o'quvchi uchun SPF/DKIM/DMARC, umumiy shoshilish triggerlari va havolani bosmasdan tekshirishning xavfsiz usulini qamrab oladi.",
      indicators: [
        {
          label: "Yuboruvchi domeni — taqlid",
          detail:
            "Ekran nomi 'IT Xavfsizlik' deydi lekin From manzili it-security@bаnk.uz — kirill 'а' ga e'tibor bering. Homoglyph hujumlari hozir asosiy phishing vektori.",
          severity: "critical",
        },
        {
          label: "Shoshilish / qo'rquv tili",
          detail:
            "'Hisobingiz 15 daqiqada bloklanadi' — bu o'ylab ko'rishni chetlab o'tish uchun mo'ljallangan. Qonuniy IT xabarlar kunlar beradi, daqiqalar emas.",
          severity: "critical",
        },
        {
          label: "Havola maqsadi ≠ havola matni",
          detail:
            "Hover (bosmang) — agar URL oldindan ko'rish ko'rinadigan matndan farq qilsa, isbotlanmaguncha bu phishing.",
          severity: "high",
        },
        {
          label: "Kutilmagan biriktirma",
          detail:
            "ISO, HTML va OneNote fayllari — 2025-yil zararli dasturlarni yetkazib berishning tanlangan formatlari — Office makroslarini chetlab o'tadi.",
          severity: "medium",
        },
      ],
      correctAction: {
        label: "Report-Phishing tugmasi orqali SOC'ga xabar berish",
        rationale:
          "Xabar berish emailni SOC navbatiga IoC ajratish uchun joylashtiradi (yuboruvchi, URL, biriktirma xeshi) va tenant-keng blokni ishga tushiradi. Bitta xabar har bir boshqa pochta qutisini himoya qiladi.",
      },
      partialAction: {
        label: "Karantinga olib o'chirish",
        rationale:
          "Shaxsiy ta'siringizni olib tashlaydi, lekin tashkilotning qolgan qismi himoyasiz qoladi. SOC kampaniyani bloklash uchun kerakli IoC'larni yo'qotadi.",
      },
      failAction: {
        label: "Identifikatsiyani tasdiqlash uchun maxfiy ma'lumotlar bilan javob berish",
        rationale:
          "O'yin tugadi. Maxfiy ma'lumotlar olindi → hujumchi tizimga kiradi → foydalanuvchini MFA push-bomb qiladi → ma'lumotlar tashqariga chiqariladi. Aksariyat bank buzilishlari aynan shu yerdan boshlanadi.",
      },
      takeaways: [
        "Bosishdan oldin hover qiling — har doim.",
        "Shoshilish — phishing alomati, tezroq harakat qilish sababi emas.",
        "Report-Phishing tugmasini ishlating, Delete tugmasini emas.",
        "Homoglyflar (lotin domenlaridagi kirill harflari) vizual tekshiruvni mag'lub qiladi.",
      ],
    },
    "cyber-m2": {
      title: "SOC ogohlantirish triaji",
      subtitle: "Jiddiylik, noto'g'ri ijobiylar va tahlilchi charchog'i",
      objective:
        "Tasdiqlash → Tekshirish → Tasniflash → Harakat qilish triaj voronkasini shovqinli SOC navbatiga qo'llang.",
      overview:
        "Tier-1 SOC tahlilchisi smenani navbatda 240 ogohlantirish bilan boshlaydi. Aksariyati sozlash bo'shliqlaridan noto'g'ri ijobiylardir; bir nechtasi haqiqiy. Ushbu modul triaj voronkasini, boyitishni tez tekshirish uchun qanday foydalanishni va nima uchun yetarli triaj ko'p triajdan xavfliroq ekanligini qamrab oladi.",
      indicators: [
        {
          label: "Ogohlantirish hajmi asosdan yuqori",
          detail:
            "Bir manbadan to'satdan sakrash odatda sozlash muammosi — lekin ba'zan haqiqiy zond.",
          severity: "medium",
        },
        {
          label: "Bir nechta manbalar bo'ylab korrelyatsiya",
          detail:
            "Bir IP EDR, NetFlow va WAF qoidalarini ishga tushirsa, isbotlanmaguncha haqiqiy ijobiy.",
          severity: "high",
        },
        {
          label: "Aktiv ahamiyati",
          detail:
            "Domain controller'da ogohlantirish — qoida nima desa ham hech qachon past ustuvor emas.",
          severity: "critical",
        },
      ],
      correctAction: {
        label: "Kelish tartibida emas, ahamiyatiga ko'ra triaj qiling",
        rationale:
          "FIFO triaj — SOC'larni kuydirgan narsa. Navbatni aktiv ahamiyati va manba korrelyatsiyasi bo'yicha tartiblang, keyin uzun dumni boshqaring.",
      },
      partialAction: {
        label: "Past jiddiylikdagi ogohlantirishlarni noto'g'ri ijobiy sifatida ommaviy yopish",
        rationale:
          "Ba'zan to'g'ri, ba'zan halokatli. Ommaviy yopishni faqat bir nechtasini namuna olib namunani tasdiqlagandan keyin qiling.",
      },
      failAction: {
        label: "Smena oxirigacha navbatni tozalash uchun ogohlantirishlarni yopish",
        rationale:
          "Navbatni bo'shatish xatti-harakati — buzilishlar qanday o'tkazib yuboriladi. Keyingi smena toza taxtani ko'radi va topish kerak bo'lgan narsa yo'q deb taxmin qiladi.",
      },
      takeaways: [
        "Triaj voronkasi: Tasdiqlash → Tekshirish → Tasniflash → Harakat qilish.",
        "Aktiv ahamiyati ogohlantirish jiddiyligidan ustun.",
        "Noto'g'ri ijobiy asoslarni hujjatlang — bu aniqlash sozlashini ta'minlaydi.",
        "Tozalash uchun hech qachon yopmang; qarorni qayd qilish uchun yoping.",
      ],
    },
    "cyber-m3": {
      title: "Insidentga javob · NIST 800-61",
      subtitle: "Tayyorgarlik → Aniqlash → Cheklash → Yo'q qilish → Tiklash → Saboqlar",
      objective:
        "Tasdiqlangan insidentni cheklash va yo'q qilishni aralashtirmasdan NIST IR hayot tsikli bo'ylab o'tkazing.",
      overview:
        "Endpoint EDR moliya ish stantsiyasida ransomware stayging vositasini tasdiqlaydi. Soat boshlanadi. Ushbu modul oltita NIST 800-61 bosqichini va boshqalardan ko'p javoblarni o'ldiradigan bitta xato — dalillar saqlanishidan oldin hostlarni qayta qurish — orqali o'tadi.",
      indicators: [
        {
          label: "Diskda stayging vositasi",
          detail:
            "Mimikatz / Cobalt Strike beacon — operator interaktiv kirishga ega ekanligini bildiradi. Soatlar, kunlar emas.",
          severity: "critical",
        },
        {
          label: "Lateral harakat urinishlari",
          detail:
            "EDR ta'sirlangan hostdan SMB sanab chiqishini ko'rsatadi — hujumchi xaritalayapti.",
          severity: "critical",
        },
        {
          label: "Domain admin tokenlari keshlangan",
          detail:
            "Agar admin yaqinda bu hostga kirgan bo'lsa, token olinishi mumkin. Maxfiy ma'lumotlarni almashtirishni rejalashtiring.",
          severity: "high",
        },
      ],
      correctAction: {
        label: "Hostni izolyatsiya qiling, xotirani saqlang, keyin yo'q qiling",
        rationale:
          "Tarmoq-izolyatsiya qiling (o'chirmang — RAM dalili). Diskni image qiling. Keyin yo'q qiling va maxfiy ma'lumotlarni almashtiring. Tiklash faqat yo'q qilish tasdiqlanganidan keyin.",
      },
      partialAction: {
        label: "Hostni darhol qayta image qilish",
        rationale:
          "Qonni to'xtatadi lekin dalillarni yo'q qiladi. Faqat host muhim bo'lmasa va IR jamoasi vaqt byudjeti ichida unga yetib kelmasa qabul qilinadi.",
      },
      failAction: {
        label: "'Hujumni to'xtatish' uchun hostni o'chirish",
        rationale:
          "Uchuvchan xotirani (maxfiy ma'lumotlar, shifrlash kalitlari, hujumchi artefaktlari) yo'q qiladi va ko'p shtammlarda qayta yuklash paytida ransomware shifrlashini ishga tushiradi.",
      },
      takeaways: [
        "Tarmoq qatlamida izolyatsiya qiling, quvvat tugmasida emas.",
        "Diskdan oldin xotirani saqlang; qayta yuklashdan oldin diskni.",
        "Cheklash ≠ yo'q qilish. Bosqichlarni o'tkazib yubormang.",
        "Saboqlar Olindi majburiy, ixtiyoriy emas.",
      ],
      references: ["NIST SP 800-61r2 — Kompyuter Xavfsizligi Insidentlarini Boshqarish Qo'llanmasi"],
    },
    "cyber-m4": {
      title: "Zero Trust kirish",
      subtitle: "Hech qachon ishonmang, har doim tekshiring — har so'rovda",
      objective:
        "Zero Trust printsipini (so'rov bo'yicha tekshirish, eng kam imtiyoz, buzilish deb taxmin qiling) kirish qaroriga qo'llang.",
      overview:
        "Dasturchi mijoz muammosini disk qilish uchun 'faqat bir soatga' ishlab chiqarish ma'lumotlar bazasiga kirishni so'raydi. Eski VPN modeli kirishni beradi va unutadi. Zero Trust har safar identifikatsiya, qurilma holati va niyatni tekshirishni talab qiladi. Ushbu modul uchta ustun va Zero Trust va VPN almashtirish o'rtasidagi farqni qamrab oladi.",
      indicators: [
        {
          label: "Boshqarilmagan qurilma kirishni so'rayapti",
          detail:
            "MDM'ga ro'yxatga olinmagan qurilmada holat signali yo'q. Standart bo'yicha kirish rad etiladi.",
          severity: "critical",
        },
        {
          label: "O'zgarish oynasi tashqarisidagi imtiyozli harakat",
          detail:
            "Shanba kuni soat 02:00 da insident chiptasiz ishlab chiqarish kirishi — xulq-atvor anomaliyasidir.",
          severity: "high",
        },
        {
          label: "Step-up auth siyosatda chetlab o'tilgan",
          detail:
            "Siyosat qayta autentifikatsiyasiz kirishga ruxsat beradi. Bu siyosat xatosi.",
          severity: "high",
        },
      ],
      correctAction: {
        label: "Step-up auth + vaqt bilan cheklangan ko'lam + tasdiq talab qiling",
        rationale:
          "Identifikatsiya (MFA), qurilma (boshqarilgan + sog'lom) va niyat (tasdiqlangan chipta) tekshirildi. Bir soatga to'liq sessiya yozuvi bilan kirish berildi.",
      },
      partialAction: {
        label: "Yuqori monitoring bilan doimiy kirish berish",
        rationale:
          "Ochiq VPN'dan yaxshiroq lekin hali ham eng kam imtiyozni buzadi. Faqat o'tish namunasi sifatida qabul qilinadi, manzil sifatida emas.",
      },
      failAction: {
        label: "Dasturchining mavjud VPN sessiyasini qayta ishlatish",
        rationale:
          "Yashirin ishonch. Agar VPN maxfiy ma'lumoti keyin buzilsa, hujumchi dasturchi hozirgina foydalangan yo'lda.",
      },
      takeaways: [
        "Identifikatsiya, qurilma va niyatni tekshiring — har so'rovda.",
        "Standart rad etish; ko'lam va vaqt bilan aniq ruxsat.",
        "Zero Trust — model, mahsulot emas.",
        "Imtiyozli sessiyalarni yozing — yozuvlar audit qilinadigan dalil.",
      ],
    },
    "cyber-m5": {
      title: "Deepfake ovoz tekshiruvi",
      subtitle: "CEO'ning ovozi shoshilinch o'tkazma so'raganda",
      objective:
        "Ovoz-deepfake social engineering urinishini aniqlang va har qanday moliyaviy harakatdan oldin out-of-band tekshiruvni qo'llang.",
      overview:
        "Xazina operatori telefon qo'ng'irog'i oladi. Qo'ng'iroq ID ichki, ovoz aniq CEO'niki, so'rov yangi sotuvchiga shoshilinch o'tkazma uchun. Ovoz klonlash hozir 3 soniyalik manba audio bilan 30 soniyalik ish. Ushbu modul audio alomatlar (hali mavjud bo'lsa), out-of-band qaytarish siyosati va nima uchun 'men bu ovozni bilaman' endi nazorat emasligini qamrab oladi.",
      indicators: [
        {
          label: "Hissiy bosim / vaqt shoshilishi",
          detail:
            "Deyarli har bir ovoz-deepfake firibgarlik klon ovozni 'Men yig'ilishdaman, hozir buni qiling' bilan birlashtiradi. Shoshilish sizning tekshirish odatlaringizni o'chiradi.",
          severity: "critical",
        },
        {
          label: "So'rov normal kanalni chetlab o'tadi",
          detail:
            "Xazina o'tkazmalari hujjatlashtirilgan tasdiqlash oqimiga ega. Oqimni o'tkazib yuborish so'rovi — red flag, ovoz bo'lsin yoki yo'q.",
          severity: "critical",
        },
        {
          label: "Qo'ng'iroq qiluvchi qaytarishga qarshilik ko'rsatadi",
          detail:
            "'Men qaytarishni qabul qila olmayman, batareyam tugayapti' — hujumchi qaytarishdan omon qola olmaydi chunki haqiqiy raqam unga yetib kelmaydi.",
          severity: "high",
        },
      ],
      correctAction: {
        label: "Telefonni qo'ying, ma'lum ichki raqamga qayta qo'ng'iroq qiling",
        rationale:
          "Siz ishongan raqamda out-of-band tekshiruv (qo'ng'iroq ID'dan emas, katalogdan) ovoz klonlashni butunlay mag'lub etadi. Istisnolar yo'q.",
      },
      partialAction: {
        label: "Bilimga oid savol berish",
        rationale:
          "Qaytarishni tashkil qilayotganingizda kechiktirish taktikasi sifatida yaxshi, lekin bilim savollari internetda sizib chiqishi mumkin va zamonaviy hujumchilar o'zlarini brifing qiladilar. Faqat unga tayanmang.",
      },
      failAction: {
        label: "Qo'ng'iroq-ID ishonchiga asoslanib o'tkazmani amalga oshirish",
        rationale:
          "Qo'ng'iroq ID osongina soxtalashtiriladi. O'tkazma chiqib ketadi, pul daqiqalarda yo'qoladi, SWIFT qaytarish oynasida tutsangiz tiklanishi mumkin.",
      },
      takeaways: [
        "Ovoz endi autentifikatsiya emas — uni faqat identifikatsiya sifatida ko'ring.",
        "Katalogda ro'yxatga olingan raqamda out-of-band qaytarish — bu nazorat.",
        "Shoshilish — hujum vektori, nazoratlarni o'tkazib yuborish sababi emas.",
        "Hujjatlang va xabar bering — bu urinishlar sizning xabardorlik treningingizni urug'lantiradi.",
      ],
    },
    "fraud-m1": {
      title: "Mule hisob aniqlash",
      subtitle: "Tezlik, yosh va kirish-chiqish patterni",
      objective:
        "Pul-mule hisobini tranzaksiya shaklidan aniqlang va u tushib ketmasdan oldin muzlatib qo'ying.",
      overview:
        "Yangi hisob bog'lanmagan chakana mijozlardan kichik kirish o'tkazmalarining tez ketma-ketligini oladi, darhol xorijdagi bitta beneficiarga chiqish o'tkazmalari bilan davom etadi. Bu klassik mule patterni — hisob egasi o'zi qurbon bo'lishi mumkin. Ushbu modul tezlik ballashi, yosh × qiymat evristikasi va muzlatish-yoki-monitoring qarorini qamrab oladi.",
      indicators: [
        {
          label: "Tezlik 9.4× asosdan",
          detail:
            "Tranzaksiya chastotasi hisobning o'z asosidan deyarli kattalik tartibida yuqori — hisob ishlatilmoqda.",
          severity: "critical",
        },
        {
          label: "Bog'lanmagan tomonlardan kirish",
          detail:
            "24 soatda 10+ noyob yuboruvchi, ularning hech biri egasi bilan oldingi munosabatga ega emas.",
          severity: "high",
        },
        {
          label: "Chiqish kontsentratsiyasi",
          detail:
            "Barcha kirishlar soatlar ichida bitta xorijdagi hisobga tushadi — pul hech qachon to'xtamaydi.",
          severity: "critical",
        },
        {
          label: "Hisob yoshi 11 kun",
          detail:
            "Mule hisoblari odatda yangi — ish-firibgarlik reklamalari orqali yollangan yoki buzilgan mavjud hisoblar.",
          severity: "medium",
        },
      ],
      correctAction: {
        label: "Hisobni darhol muzlatish",
        rationale:
          "Namuna aniq. Muzlating, ichki SAR yuboring va egasiga xavfsiz kanal orqali xabar bering — egasi ko'pincha qurbon va bilishi kerak.",
      },
      partialAction: {
        label: "Firibgarlik jamoasiga ko'rib chiqish uchun eskalatsiya",
        rationale:
          "Tezlik chegarada bo'lsa qabul qilinadi. 9.4× asos va kontsentratsiya bilan sizda hashamat yo'q — firibgarlik ko'rib chiqqanda pul yo'qoladi.",
      },
      failAction: {
        label: "Monitoringni davom ettirish",
        rationale:
          "Muzlatmasdan monitoring pulning ketishini kuzatadi. Mule zanjirlari mablag'larni soatlar ichida chegaralar bo'ylab harakatlantiradi.",
      },
      takeaways: [
        "Tezlik + kontsentratsiya + yoshlik = muzlatish.",
        "Mule egalari ko'pincha qurbonlardir; muzlatishni himoyalovchi deb qarang.",
        "Muzlatgandan keyin ham ichki SAR yuboring.",
        "Faqat monitoring — qaror; nima uchun tanlaganingizni hujjatlang.",
      ],
    },
    "fraud-m2": {
      title: "Sintetik identifikatsiya firibgarligi",
      subtitle: "Haqiqiy SSN + soxta ism + 18 oylik tarbiya",
      objective:
        "Sintetik identifikatsiyalarni onboarding va kredit liniyasini yig'ish davrida aniqlang.",
      overview:
        "Ariza beruvchi balog'atga yetmaganga tegishli haqiqiy soliq ID'ni soxta ism va soxta ish tarixi bilan birgalikda ishlatadi. Ular 18 oy davomida har to'lovni o'z vaqtida amalga oshiradi — toza kredit faylini quradi — keyin 100k kredit liniyasi tortishi bilan portlab yo'qoladi. Ushbu modul ma'lumot tikish alomatlari, uchinchi tomon ma'lumotlarini tasdiqlash va bust-out patternini qamrab oladi.",
      indicators: [
        {
          label: "Soliq ID boshqa yosh oralig'iga tegishli",
          detail:
            "ID balog'atga yetmaganga berilgan; ariza beruvchi 35 yoshda deydi. Byurolararo yosh nomuvofiqliklari — eng kuchli yagona signal.",
          severity: "critical",
        },
        {
          label: "Nozik fayl, mukammal tarix",
          detail:
            "Ikkita kredit liniyasi, ikkalasi ham o'z vaqtida to'langan, ikkalasi ham bir xil 60-kunlik oynada ochilgan. 'Mukammal mijoz' patterni.",
          severity: "high",
        },
        {
          label: "Bir nechta nozik fayllar bilan ulashilgan manzil",
          detail:
            "Tarmoq tahlili manzilning o'tgan yilda ochilgan 4 ta boshqa nozik faylga bog'langanligini ko'rsatadi.",
          severity: "critical",
        },
      ],
      correctAction: {
        label: "Onboardingni rad etish + ID'ni byuro bo'ylab belgilash",
        rationale:
          "Byurolararo belgilash sintetikni o'ldiradi — ular o'sha ID'ni boshqa joyda ishlata olmaydilar. Yolg'iz harakat qilish — bir bankli tuzatish.",
      },
      partialAction: {
        label: "Past limit bilan tasdiqlash va monitoring",
        rationale:
          "Ba'zi banklar kichiklar uchun sintetik riskni qabul qiladi. Firibgarlik modelingizda bust-out triggeri bo'lsagina himoyalanadi.",
      },
      failAction: {
        label: "So'ralgan limit bilan tasdiqlash",
        rationale:
          "Bust-out'ni 18 oydan keyin ko'rasiz. O'shanda yo'qotish to'liq amalga oshirilgan bo'ladi.",
      },
      takeaways: [
        "Sintetik ≠ o'g'irlangan identifikatsiya — qo'ng'iroq qiladigan haqiqiy qurbon yo'q.",
        "Byurolararo yosh-band nomuvofiqligi — chekishi tugagan qurol.",
        "Bust-out — onboardingdan 12–24 oydan keyingi rejalashtirilgan voqea.",
        "Byurolararo belgilash har bir tutishning ta'sirini ko'paytiradi.",
      ],
    },
    "fraud-m3": {
      title: "Karta skimming · xulq-atvor aniqlash",
      subtitle: "Geografiya, terminal xeshlari va naqd pul olish oynasi",
      objective:
        "Karta skimming kompromat hisini bitta tranzaksiyani tekshirish bilan emas, xulq-atvor klasteri bo'yicha aniqlang.",
      overview:
        "Kichik kartalar klasteri to'satdan bir xil chet el shahrida bir-biridan soatlar ichida ishlatilmoqda. Egalaridan hech biri sayohat qilmaydi. Umumiy omil — o'tgan oyda ular foydalangan bitta bankomat. Ushbu modul klaster tahlili, BIN-darajadagi to'plamni va nima uchun karta-karta tekshiruvi skimingni butunlay o'tkazib yuborishini qamrab oladi.",
      indicators: [
        {
          label: "Sayohatsiz imkonsiz geografik klaster",
          detail:
            "Kartalar egasi manzilidan 3000 km uzoqlikda aviatashuv ma'lumotlari yoki rouming yozuvlarida sayohat signalisiz ishlatilgan.",
          severity: "critical",
        },
        {
          label: "Umumiy kompromat nuqtasi",
          detail:
            "Barcha ta'sirlangan kartalar 30 kunlik oynada bir xil bankomatga surilgan.",
          severity: "critical",
        },
        {
          label: "Naqd pul olish patterni: kichik tekshiruvlar, keyin maksimal",
          detail:
            "Hujumchilar $20 to'lov bilan sinab ko'radilar; agar o'tsa, karta soatlar ichida bo'shatiladi.",
          severity: "high",
        },
      ],
      correctAction: {
        label: "Klasterni bloklash + buzilgan terminalni qaytarib chaqirish",
        rationale:
          "Oyna ichida kompromat nuqtasiga tegingan barcha kartalarni bloklang, PIN'larni qayta chiqaring va terminalni jismoniy tekshirish uchun acquirer bilan muvofiqlashtiring.",
      },
      partialAction: {
        label: "Firibgarlik xabarlari kelishi bilan reaktiv bloklash",
        rationale:
          "Siz hujumchi bilan poyga olib boryapsiz. Har soat kechikish — ko'proq bo'shatilgan kartalar.",
      },
      failAction: {
        label: "Chargeback bahslar hajmi ko'tarilishini kutish",
        rationale:
          "Chargeback'lar firibgarlik voqeasidan 30–60 kun orqada. O'sha vaqtga kartalar bo'shatilgan, hujumchi ketgan va siz yo'qotishni yeysiz.",
      },
      takeaways: [
        "Bitta-karta tekshiruvi skimingni o'tkazib yuboradi.",
        "Klaster + umumiy kompromat nuqtasi = klasterni bloklash.",
        "Terminalni qaytarib chaqirish uchun acquirer bilan muvofiqlashtiring.",
        "Naqd pul olish oynasi soatlar, kunlar emas.",
      ],
    },
    "fraud-m4": {
      title: "Chargeback triaj",
      subtitle: "Birinchi tomon firibgarligi, do'stona firibgarlik va representment qarori",
      objective:
        "Kelayotgan chargeback'ni to'g'ri tasniflang va qabul qilish yoki representment qilishni hal qiling.",
      overview:
        "Mijoz $1,200 elektronika xaridini 'olinmagan' deb bahslashadi. Yetkazib berish tasdig'i mijozning manzilida imzolangan qabulni ko'rsatadi. Bu do'stona firibgarlik (ba'zan birinchi tomon firibgarlik) — mijoz tovarni oldi lekin baribir bahslashadi. Ushbu modul sabab-kodi xaritalash, dalil standartlari va qachon representment qilish yoki qabul qilishni qamrab oladi.",
      indicators: [
        {
          label: "Mijozda oldingi chargeback tarixi bor",
          detail:
            "O'tgan yilda uchta bahs. Do'stona-firibgarlik seriya jinoyatchilari odatda seriya.",
          severity: "high",
        },
        {
          label: "Yetkazib berish tasdiqlangan",
          detail:
            "Mijoz manzili bilan imzolangan POD. Representment uchun kuchli dalil.",
          severity: "medium",
        },
        {
          label: "Sabab kodi mos kelmaydi",
          detail:
            "Mijoz 'olinmagan' deydi lekin uni onlayn ishlatdi (qurilmadan bog'langan hisob kirishi).",
          severity: "high",
        },
      ],
      correctAction: {
        label: "To'liq dalil to'plami bilan representment",
        rationale:
          "POD + qurilma mosligi + chargeback tarixi = kuchli representment ishi. Do'stona firibgarlikni qabul qilish mijozga buning ishlashini o'rgatadi.",
      },
      partialAction: {
        label: "Barcha dalilsiz representment",
        rationale:
          "Yarim-dalilli representment'lar yutishdan ko'p yo'qotadi va emitent xayrixohligini yondiradi.",
      },
      failAction: {
        label: "Kurashdan qochish uchun chargeback'ni qabul qilish",
        rationale:
          "Qisqa muddatli xarajat minimallashtirish, uzoq muddatli xato. Har bir qabul qilingan bahs mijozga pattern ishlashini o'rgatadi va tarmoq darajasidagi chargeback nisbatingizni oshiradi.",
      },
      takeaways: [
        "Do'stona firibgarlik — firibgarlik. Uni representment qiling.",
        "Dalil sifati yutish stavkasini aniqlaydi.",
        "Chargeback nisbatini kuzating — tarmoq dasturlari yuqori nisbatlarni jazolaydi.",
        "Faqat dalil haqiqatan nozik bo'lganida qabul qiling.",
      ],
    },
    "fraud-m5": {
      title: "AI anomaliya sozlash",
      subtitle: "Aniqlik, qaytarish va noto'g'ri ijobiyning narxi",
      objective:
        "Firibgarlik aniqlash modelini biznes narxiga qarshi noto'g'ri ijobiylar va noto'g'ri salbiylarni muvozanatlash uchun sozlang.",
      overview:
        "Firibgarlik modeli 12% noto'g'ri ijobiylarni keltirib chiqaradi, bu qonuniy mijoz tajribasini urib turibdi. Chegarani bo'shashtirish noto'g'ri ijobiylarni kamaytiradi lekin noto'g'ri salbiylarni — haqiqiy firibgarlik o'tkazib yuborilishini — ko'taradi. Ushbu modul aniqlik/qaytarish kelishuvlari, narx-vaznli optimallashtirish va nomuvozanatlangan muammoda aniqlikni optimallashtirish tuzog'ini qamrab oladi.",
      indicators: [
        {
          label: "Noto'g'ri ijobiy darajasi 5% dan yuqori",
          detail:
            "5% dan yuqorida mijoz shikoyatlari sakraydi va operatsiya jamoasi ogohlantirishlarni avtomatik tasdiqlashni boshlaydi — modelni mag'lub etadi.",
          severity: "high",
        },
        {
          label: "Qayta aloqa halqasi buzilgan",
          detail:
            "Operatorlar natijani belgilamasdan ogohlantirishlarni yopadi. Belgilarsiz model qayta o'rgatilolmaydi.",
          severity: "critical",
        },
        {
          label: "Ma'lumotlar siljishi",
          detail:
            "Model 18 oy oldin o'rgatildi; tranzaksiya aralashmasi siljidi (ko'proq kontaktsiz, kamroq bankomat). Ish faoliyati jim degraditsiyalanadi.",
          severity: "high",
        },
      ],
      correctAction: {
        label: "Narx-vaznli chegaraga sozlash + qayta aloqa halqasini tiklash",
        rationale:
          "(noto'g'ri-ijobiy narx × FP darajasi) + (firibgarlik yo'qotish × FN darajasi)ni minimallashtiradigan chegarani toping. Operatorlarni natijalarni belgilashga majbur qiling — qayta aloqa yo'q, qayta o'rgatish yo'q.",
      },
      partialAction: {
        label: "Chegarani bir tekisda bo'shashtirish",
        rationale:
          "Noto'g'ri ijobiylarni kamaytiradi lekin firibgarlik tutishlarini mutanosib yo'qotadi. Narx-vaznlash deyarli har doim bir tekis sozlashdan ustun.",
      },
      failAction: {
        label: "Shovqinli segmentlar uchun qo'lda chetlash istisnolarini qo'shish",
        rationale:
          "Istisno ro'yxatlari doimiy bo'lib qoladi. Model ular atrofida eskirib qoladi va firibgarlik jamoangiz hech qachon ildiz sababini tuzatishga qaytmaydi.",
      },
      takeaways: [
        "Aniqlik firibgarlikda foydasiz metrika — aniqlik va qaytarishni ishlatang.",
        "Chegarani narx-vaznlang; bir tekis sozlash — qo'pol vosita.",
        "Qayta aloqa halqasi yo'q = model yo'q. Operatorlar belgilashi kerak.",
        "Ma'lumotlar siljishini kuzating; shikoyatda emas, jadval bo'yicha qayta o'rgating.",
      ],
    },
    "cx-m1": {
      title: "Manzil o'zgartirish · tekshiruv",
      subtitle: "Account takeover'ni yashiradigan kichik so'rov",
      objective:
        "Manzil o'zgartirish so'rovini qonuniy mijozni begonalashtirmasdan yoki hisob egallashga imkon bermasdan tekshiring.",
      overview:
        "Mijoz ro'yxatga olingan manzilini o'zgartirish uchun qo'ng'iroq qiladi. Yangi manzil boshqa hududda. Manzil o'zgartirish — hisob egallashining eng keng tarqalgan ko'rsatkichi: manzilni o'zgartiring, keyin yangi manzilga karta qayta chiqarishini so'rang. Ushbu modul tekshiruv zinapoyasi va uni qo'llashda mijoz tajribasini iliq saqlash usulini qamrab oladi.",
      indicators: [
        {
          label: "Yangi manzil boshqa hududda",
          detail:
            "Hududlararo ko'chishlar qo'shimcha tekshiruvni talab qiladi; bir xil shahar ko'chishlari odatda talab qilmaydi.",
          severity: "medium",
        },
        {
          label: "Qo'ng'iroq qiluvchi bilim omilini tasdiqlay olmaydi",
          detail:
            "So'nggi tranzaksiya miqdorini yoki bog'langan telefon raqamini eslay olmaydi.",
          severity: "critical",
        },
        {
          label: "So'nggi parol qayta tiklanishi",
          detail:
            "Parol so'nggi 48 soatda tan olinmagan qurilmadan o'zgartirildi. Parol qayta tiklanishidan keyin manzil o'zgartirish — egallash ketma-ketligi.",
          severity: "critical",
        },
      ],
      correctAction: {
        label: "Ikki omil orqali tekshirish, 24 soatlik sovutish davrini qo'llash",
        rationale:
          "Ikki omilli tekshiruv + qayta chiqarishdan oldin kechikish egallashni qonuniy so'rovni bloklashsiz tutadi. Mijozga ehtiyotkorlik bilan xabar beriladi.",
      },
      partialAction: {
        label: "Bir omil orqali tekshirish, darhol o'zgartirish",
        rationale:
          "Past riskli profillar uchun qabul qilinadi. Parol-qayta tiklash signali mavjud bo'lsa qabul qilinmaydi.",
      },
      failAction: {
        label: "Faqat qo'ng'iroq qiluvchining bayon qilingan bilimi asosida o'zgartirish",
        rationale:
          "Hisob egallash tugadi. Keyingi qo'ng'iroq hujumchidan 'yangi kartam qaerda' bo'ladi.",
      },
      takeaways: [
        "Manzil o'zgartirish odatiy his etilsa-da yuqori riskli.",
        "Risk signallari mavjud bo'lsa ikki omil bilan tekshiring.",
        "Sovutish davrlari mijozlarni haqorat qilmasdan egallashlarni tutadi.",
        "Tekshiruvni shubha sifatida emas, g'amxo'rlik sifatida tushuntiring.",
      ],
    },
    "cx-m2": {
      title: "Hisob bloklash · empatiya bilan",
      subtitle: "Yomon yangilikni munosabatlarni yo'qotmasdan yetkazish",
      objective:
        "Compliance-asoslangan hisob blokini mijozga aniqlik, empatiya va oldinga yo'l bilan yetkazib bering.",
      overview:
        "Mijoz restoranda kartasi rad etilganidan g'azablangan holda filialga keladi. Blok compliance-asoslangan (chiqish o'tkazmasidagi sanksiya skrining tushishi) va siz aniq sababni oshkor qila olmaysiz. Ushbu modul oshkor qilmasdan empatiya tili, eskalatsiya stsenariysi va hujjatlashtirish talabini qamrab oladi.",
      indicators: [
        {
          label: "Mijoz ommaviy uyatga qoldirilgan",
          detail:
            "Restoran qarshisida mehmonlar oldida kart rad etildi. Hissiy holat operatsion tuzatish kabi muhim.",
          severity: "high",
        },
        {
          label: "Siz sababni oshkor qila olmaysiz",
          detail:
            "Sanksiya va AML bloklari maxfiy. Oshkor qilish — ogohlantirish — AML SAR modulini ko'ring.",
          severity: "critical",
        },
        {
          label: "Mijoz uzoq muddat egalik qilgan hisob",
          detail:
            "10 yillik munosabat. Bu yerdagi ishqalanish — CX narxi kabi munosabat narxidir.",
          severity: "medium",
        },
      ],
      correctAction: {
        label: "Tan oling, kechirim so'rang, o'sha kuni eskalatsiya qiling",
        rationale:
          "Tajribalarini tan oling, ishqalanish uchun kechirim so'rang, o'sha kuni compliance'ga eskalatsiya qilishni va'da qiling va shaxsan kuzatib boring. Empatiya + egalik + tezlik.",
      },
      partialAction: {
        label: "Qayta qo'ng'iroq olish va standart navbat orqali yo'naltirish",
        rationale:
          "Tinch filialda qabul qilinadi. Mijoz oldingizda ahvolda bo'lsa qabul qilinmaydi.",
      },
      failAction: {
        label: "Mijozga blok sababini aytish",
        rationale:
          "Ogohlantirish buzilishi. Operator uchun shaxsiy huquqiy va tartibga solish oqibatlari.",
      },
      takeaways: [
        "Empatiya birinchi, jarayon ikkinchi.",
        "Oshkor qilmasdan tan ola olasiz.",
        "O'sha kun eskalatsiyasi — munosabatlarni saqlovchi.",
        "Mijozning hissiy holatini hujjatlang — bu ishning bir qismi.",
      ],
    },
    "cx-m3": {
      title: "Imkoniyati cheklangan mijozlar",
      subtitle: "Oqilona moslashish — istisno emas, standart",
      objective:
        "Imkoniyati cheklangan mijozga har qanday boshqa mijoz bilan bir xil qadr-qimmat va samaradorlik bilan xizmat qiling.",
      overview:
        "Past ko'rishli mijozga olib qo'yish blankani to'ldirishda yordam kerak. Standart siyosat 'mijoz blankani o'zi imzolashi kerak' deydi. Imkoniyatlilik qonuni va yaxshi amaliyot 'yo'lni toping' deydi. Ushbu modul WCAG-yondosh xizmat printsiplari, ishonchli-yordamchi hujjatlashning roli va saqlanadigan tilni qamrab oladi.",
      indicators: [
        {
          label: "Mijoz boshqa xodimlar tomonidan shoshilmoqda",
          detail:
            "Ko'rinadigan noqulaylik, navbat yig'iladi. Vaqt bosimi — imkoniyatlilik dushmani.",
          severity: "high",
        },
        {
          label: "Blank kichik shrift o'qishni talab qiladi",
          detail:
            "Standart blank imkoniyatli emas. Katta-shrift yoki audio muqobil tayyor bo'lsin.",
          severity: "medium",
        },
        {
          label: "Ishonchli yordamchi bor, lekin tan olinmagan",
          detail:
            "Do'st yoki oila a'zosi keldi. Ularni tan oling, rolni hujjatlang.",
          severity: "low",
        },
      ],
      correctAction: {
        label: "Shaxsiy stolga o'tib, blankani ovoz chiqarib o'qing, tushunishni tasdiqlang",
        rationale:
          "Vaqt + maxfiylik + oddiy til = qo'shilish. Moslashishni keyingi safar uchun xizmat eslatmasi sifatida hujjatlang.",
      },
      partialAction: {
        label: "Siz keyingi mijozga xizmat qilayotganda hamkasbingizdan yordam so'rang",
        rationale:
          "Agar hamkasbda trening bo'lsa OK. 'Qiyin' o'zaro ta'sirni yuklash usuli sifatida OK emas.",
      },
      failAction: {
        label: "Imzolangan standart blanksiz qayta ishlashni rad etish",
        rationale:
          "Teng-kirish qonunini buzishi mumkin. Har doim munosabat muvaffaqiyatsizligi.",
      },
      takeaways: [
        "Imkoniyatlilik — standart, alohida holat emas.",
        "Vaqt + maxfiylik + oddiy til — formula.",
        "Moslashishlarni hujjatlang — keyingi tashrifda tayyor bo'lishi kerak.",
        "Ishonchli-yordamchi munosabati aniq tan olinishini talab qiladi.",
      ],
    },
    "cx-m4": {
      title: "Ichki eskalatsiya protokoli",
      subtitle: "Qachon eskalatsiya qilish, kimga eskalatsiya qilish va nima keltirish",
      objective:
        "Ishni o'z vaqtingizni yoki eskalatsiya jamoasi vaqtini behuda sarflasdan to'g'ri ichki jamoaga eskalatsiya qiling.",
      overview:
        "Murakkab ish xazina, compliance va operatsiyalarni qamrab oladi. Bitta jamoaga eskalatsiya qilish qaytib keladi. Ushbu modul eskalatsiya matritsasi, eskalatsiya jamoasi kutadigan ish-xulosa formati va eskalatsiya va voz kechish o'rtasidagi farqni qamrab oladi.",
      indicators: [
        {
          label: "Ish bir nechta jamoalarni qamrab oladi",
          detail:
            "Yolg'iz-jamoa eskalatsiyasi qaytariladi. Barcha egalarini oldindan aniqlang.",
          severity: "high",
        },
        {
          label: "SLA soati boshlandi",
          detail:
            "Tartibga solish yoki shartnomaviy soat; eskalatsiyada boshlanish vaqtini hujjatlang.",
          severity: "critical",
        },
        {
          label: "Mijozga xabar berildi",
          detail:
            "Agar yo'q bo'lsa, eskalatsiyadan oldin qiling — mijoz yana qo'ng'iroq qiladi va keyingi operator sovuq bo'ladi.",
          severity: "medium",
        },
      ],
      correctAction: {
        label: "Tuzilgan ish xulosasini yozing + barcha egalarini aniqlang + mijozga-yo'naltirilgan rahbar cc",
        rationale:
          "Xulosa shabloni: kim/nima/qachon/nima uchun-hozir/nima sinaganingiz. Barcha egalar cc qilingan. Mijozga-yo'naltirilgan rahbar bilib turadi — qaytarishni qabul qila oladi.",
      },
      partialAction: {
        label: "'Iltimos maslahat bering' bilan email mavzusini yo'naltirish",
        rationale:
          "Keyingi shaxsni ishni qayta qurishga majbur qiladi. Faqat juda oddiy ishlar uchun qabul qilinadi.",
      },
      failAction: {
        label: "Bajarmasdan turib mijozga 'eskalatsiya qildim' deyish",
        rationale:
          "Ishonchni buzish. Kuzatuv qo'ng'irog'i munosabatni vayron qiladi.",
      },
      takeaways: [
        "Eskalatsiya — egalikni o'tkazish, undan voz kechish emas.",
        "Tuzilgan xulosalar javob vaqtini yarmiga qisqartiradi.",
        "Barcha egalarini oldindan aniqlang; qisman eskalatsiyalar qaytariladi.",
        "Mijozga oldindan xabar bering, keyin emas.",
      ],
    },
    "cx-m5": {
      title: "Qiyin mijoz · de-eskalatsiya",
      subtitle: "Avval shaxsni tinchlantiring, keyin muammoni yeching",
      objective:
        "G'azabli mijoz o'zaro ta'sirini tan olingan til namunalari yordamida pasaytiring va suhbatni yechim tomon qayta sozlang.",
      overview:
        "Mijoz filialda hech qachon aytilmagan deyilgan to'lov haqida baqirmoqda. Ular g'azabli, qisman to'g'ri va orqalaridagi navbat o'sib bormoqda. Ushbu modul uch-bosqichli de-eskalatsiya namunasi (tan olish → nomlash → taklif qilish), keyinroq eskalatsiyaga olib keladigan so'zlar va menejerni qachon jalb qilishni qamrab oladi.",
      indicators: [
        {
          label: "Mijozning hajmi ko'tarilmoqda",
          detail:
            "Ularning hajmiga mos kelish — kuchaytiradi; sizning hajmingizni bir bosqich pasaytirish — xonani qayta sozlovchi belgi.",
          severity: "high",
        },
        {
          label: "Mijoz qisman to'g'ri",
          detail:
            "To'lov oshkor qilingan edi lekin mayda shriftda. Shikoyatning qonuniy qismini tan olish — qulf ochilishi.",
          severity: "medium",
        },
        {
          label: "Boshqa mijozlar qarayapti",
          detail:
            "Iloji bo'lsa shaxsiy stolga o'ting — ommaviy g'azab tinglovchilarga oziqlanadi.",
          severity: "medium",
        },
      ],
      correctAction: {
        label: "Hissiyotni tan oling, masalani nomlang, keyingi qadamni taklif qiling",
        rationale:
          "'Bu g'azablantirgani ko'rinib turibdi. Oshkor qilish mayda shriftda edi — to'lovni ko'rib chiqishga olib boraman va 30 daqiqada qo'ng'iroq qilaman.' Uch jumla. Mijoz eshitilgan va yo'l belgilangan.",
      },
      partialAction: {
        label: "Darhol xayriya kreditini taklif qilish",
        rationale:
          "Belgini yechadi, munosabatni emas. Mijoz vaqtda qisqarganida qabul qilinadi lekin eshitilishi kerak bo'lganida emas.",
      },
      failAction: {
        label: "Siyosatni so'zma-so'z himoya qilish",
        rationale:
          "Har safar eskalatsiya qiladi. Mijoz 'siz noto'g'risiz va men g'amxo'rlik qilmayman' deb eshitadi.",
      },
      takeaways: [
        "Tan olish → nomlash → taklif qilish — de-eskalatsiya namunasi.",
        "Hajmingizni pasaytiring; xona ergashadi.",
        "Iloji bo'lsa shaxsiy maydonga o'ting.",
        "Xayriya — vosita, eshitilishning o'rnini bosuvchi emas.",
      ],
    },
  },
};
