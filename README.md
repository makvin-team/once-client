# AI Mentor — Client

Bank xodimlarini AI yordamida o'qitish platformasining frontend qismi.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS · React Router 7

---

## Ishga tushirish

```bash
npm install
npm run dev        # http://localhost:5173
```

## Buyruqlar

| Buyruq | Vazifa |
|--------|--------|
| `npm run dev` | Development server |
| `npm run build` | Production build (`dist/`) |
| `npm run preview` | Build natijasini local ko'rish |
| `npm run lint` | ESLint tekshiruv |

## Environment o'zgaruvchilari

`.env.local` faylini yarating (git'ga kirmaydi):

```env
# Demo so'rov yuborish API
VITE_DEMO_API_URL=https://your-backend/api/demo-requests
VITE_DEMO_API_METHOD=POST

# Auth
VITE_LOGIN_API_URL=https://your-backend/api/auth/login
VITE_GOOGLE_OAUTH_URL=https://your-backend/auth/google
VITE_SSO_INIT_URL=https://your-backend/auth/sso
```

> Agar `.env.local` bo'lmasa — API chaqiruvlar mock rejimida ishlaydi (real server kerak emas).

## Fayl tuzilmasi

```
src/
├── assets/                  ← Rasmlar, SVG
├── auth/                    ← AuthProvider, RequireAuth, permissions
├── components/
│   ├── app/                 ← AppShell, Sidebar, DataTable, PageHeader ...
│   ├── sections/            ← Landing sahifa bo'limlari
│   └── ui/                  ← Button, Input, Card, Badge ...
├── content/                 ← Landing matnlari (landing.ts)
├── data/                    ← Mock ma'lumotlar
├── i18n/                    ← en · uz · uz-Cyrl · ru tarjimalar
├── lib/                     ← api.ts, analytics.ts, theme.ts
├── pages/
│   ├── admin/               ← Dashboard, Users, boshqa admin sahifalar
│   └── learner/             ← Plans, PlanDetail, LessonViewer, Assistant
└── main.tsx
```

## Tillar

Platforma to'rtta tilda ishlaydi: **English · O'zbekcha · Ўзбекча · Русский**

Yangi til qo'shish: `src/i18n/` papkasiga tarjima fayli yarating va `src/i18n/index.tsx` ga qo'shing.

## Mock rejim

`VITE_LOGIN_API_URL` o'rnatilmagan holda login sahifasida quyidagi emaillar ishlaydi:

| Email | Rol |
|-------|-----|
| `admin@...` | Admin |
| boshqa | Learner |
