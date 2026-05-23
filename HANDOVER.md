# once — Frontend Handover

Frontend for the **once** platform. Single-page React + TypeScript app served
by Vite, styled with Tailwind v3 against the Miro-derived design tokens in
`tailwind.config.js`. Ships with 4 locales (EN · UZ Latin · UZ Cyrillic · RU)
and a full light/dark theme.

The codebase covers three surfaces in a single SPA:

1. **Public landing** (`/`) — marketing page + demo request form (12 sections)
2. **Login** (`/login`) — Google OAuth + SSO + email/password
3. **Learner Site** (`/learner/**`) — TZ § 3
4. **Admin Site** (`/admin/**`) — TZ § 4

Routing is role-aware: `<RequireAuth>` blocks unauthenticated visitors and
`<RequireRole>` redirects learners away from `/admin` (and vice-versa) to the
right home.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
npm run preview  # serves dist/ locally
```

## Demo flow

The app currently runs against an in-memory mock layer — no backend required.

1. Visit `/login` and sign in with any of the seeded role keywords. The email
   keyword infers the role (mock backend); password must be ≥ 8 chars:
   - `aziz@bank.uz`         → Learner
   - `hr@bank.uz`           → HR Admin
   - `train@bank.uz`        → Training Manager
   - `compli@bank.uz`       → Compliance Manager
   - `content@bank.uz`      → Content Manager
   - `admin@once.uz`        → Super Admin
2. After login, learners land at `/learner`, admins at `/admin`.
3. The **Role switcher** chip in the app header (dashed border, top-right) lets
   reviewers swap personas without re-logging-in — useful for demoing each
   role's sidebar and permission gating.

## Architecture

```
src/
├── App.tsx                       # Router + route guards
├── main.tsx                      # I18nProvider + ThemeProvider + AuthProvider wiring
├── auth/
│   ├── AuthProvider.tsx          # Mock auth Context (role-keyed user)
│   ├── permissions.ts            # Role → Permission matrix (TZ § 5)
│   ├── RequireAuth.tsx           # Redirects unauth visitors to /login
│   └── RequireRole.tsx           # Routes between /learner ↔ /admin
├── data/
│   ├── entities.ts               # ~30 entity types (TZ § 6)
│   └── mock.ts                   # In-memory fixtures + selectors
├── components/app/               # App-shell primitives:
│   │                             #   PageHeader, EmptyState, StatCard,
│   │                             #   Sidebar, AppHeader, DataTable,
│   │                             #   StatusPill, StubPage, RoleSwitcher,
│   │                             #   AppShell, icons.tsx
├── pages/
│   ├── learner/
│   │   ├── LearnerLayout.tsx     # Sidebar + header + outlet
│   │   ├── Dashboard.tsx         # ✅ real
│   │   ├── Plans.tsx             # ✅ real
│   │   ├── PlanDetail.tsx        # ✅ real
│   │   ├── ModuleDetail.tsx      # ✅ real
│   │   ├── LessonViewer.tsx      # ✅ real (text + checklist + video stub)
│   │   └── stubs.tsx             # Assistant / Playground / Dialog / Fraud
│   │                             #         / Progress / Notifications / Settings
│   ├── admin/
│   │   ├── AdminLayout.tsx       # Permission-aware sidebar
│   │   ├── Dashboard.tsx         # ✅ real
│   │   ├── Users.tsx             # ✅ real (search + filters + pagination)
│   │   └── stubs.tsx             # 16 admin functional areas
│   ├── Home.tsx                  # Landing
│   └── Login.tsx                 # Multi-method login (signs in via AuthProvider)
└── i18n/
│   ├── types.ts                # LandingContent shape — single source of truth
│   ├── en.ts                   # English  (source-of-truth literals)
│   ├── uz.ts                   # O'zbekcha (Latin)
│   ├── uz-Cyrl.ts              # Ўзбекча (Cyrillic)
│   ├── ru.ts                   # Русский
│   └── index.tsx               # I18nProvider, useT(), useLocale(), LOCALES
├── lib/
│   ├── theme.ts                # light/dark theme — useTheme(), applyTheme()
│   ├── analytics.ts            # track() — pushes to window.dataLayer + CustomEvent
│   ├── api.ts                  # submitDemoRequest() — fetch with timeout
│   ├── scroll.ts               # smooth-scroll anchor helper
│   ├── useInView.ts            # IntersectionObserver hook for section-view analytics
│   └── cn.ts                   # clsx wrapper
├── components/
│   ├── ui/                     # Button, Card, Badge, Input, Select, Textarea, Field,
│   │                           # Logo, SectionHeader, ThemeToggle, LanguageSwitcher
│   └── sections/               # All 12 landing sections
└── pages/Home.tsx              # Assembles sections + fires page_viewed
```

## Sections (TZ § 3)

| # | TZ section | File | Anchor |
|---|---|---|---|
| 3.1  | Hero               | `sections/Hero.tsx`          | (top) |
| 3.2  | Problem            | `sections/Problem.tsx`       | `#problem` |
| 3.3  | Solution           | `sections/Solution.tsx`      | — |
| 3.4  | Core features      | `sections/Features.tsx`      | `#features` |
| 3.5  | Fraud & risk       | `sections/Fraud.tsx`         | `#fraud` |
| 3.6  | Business value     | `sections/BusinessValue.tsx` | `#value` |
| 3.7  | How it works       | `sections/HowItWorks.tsx`    | `#how` |
| 3.8  | Target users       | `sections/TargetUsers.tsx`   | — |
| 3.9  | MVP / Pilot plan   | `sections/PilotPlan.tsx`     | `#pilot` |
| 3.10 | Demo request form  | `sections/DemoForm.tsx`      | `#demo` |
| 3.11 | FAQ                | `sections/Faq.tsx`           | `#faq` |
| 3.12 | Footer             | `sections/Footer.tsx`        | — |

Also: `sections/PromoBanner.tsx` (top strip) and `sections/TopNav.tsx`
(sticky nav + mobile menu + language switcher + theme toggle).

## Localization

Four locales ship by default — listed in `LOCALES` in `src/i18n/index.tsx`:

| Code      | Short | Label       | `<html lang>` |
|-----------|-------|-------------|---------------|
| `en`      | EN    | English     | `en`          |
| `uz`      | UZ    | O'zbekcha   | `uz`          |
| `uz-Cyrl` | ЎЗ    | Ўзбекча     | `uz-Cyrl`     |
| `ru`      | RU    | Русский     | `ru`          |

**How it works**

- Every section calls `const t = useT()` and reads strings from `t.<section>.*`.
- Components contain **no hardcoded copy** — `grep -rn "'AI Mentor'"` should
  return nothing.
- The `<LanguageSwitcher />` in `TopNav` lets the user pick a locale; the
  choice is persisted in `localStorage` under `once.locale`.
- First-load detection: if no saved preference, the provider reads
  `navigator.language` and maps `ru-*` → `ru`, `uz-*` → `uz`, otherwise `en`.
- On every locale change, `<html lang="…">`, the `<title>` and the
  `<meta name="description">` are updated.

**Add a 5th locale**

1. Duplicate `src/i18n/en.ts` → `src/i18n/<code>.ts`, translate every value
   (keep the shape — TypeScript enforces it via `LandingContent`).
2. Register it in `LOCALES` and the `dictionaries` map in
   `src/i18n/index.tsx`.

## Theme (light / dark)

Tailwind runs in `darkMode: 'class'` mode. The themed color tokens
(`canvas`, `surface`, `ink`, `slate`, `hairline`, `primary`, etc.) resolve to
CSS variables defined in `src/index.css`:

```
:root  { --c-canvas: 255 255 255; … }   /* light */
.dark  { --c-canvas: 14 14 16;     … }   /* dark  */
```

Components never have to add `dark:` variants — flipping `<html class="dark">`
re-paints the whole tree.

**Flash-of-light prevention**

`index.html` carries an inline `<script>` that runs before paint and applies
the saved theme to `<html>` immediately. The same logic lives in
`src/lib/theme.ts` for HMR.

**`useTheme()` API**

```ts
const { theme, toggle, setTheme } = useTheme();
```

- Persists to `localStorage` under `once.theme`.
- If the user never picks, follows `prefers-color-scheme` and live-updates
  with it. The moment they pick, that subscription is dropped.

**Static (always-dark) tokens**

Three tokens stay "dark-feeling" in both modes for visual contrast against the
canvas:

- `bg-primary` / `text-on-primary` — black-pill primary buttons + dark CTA banner
- `bg-footer-bg` — the footer
- `on-dark` / `on-dark-muted` — text colors that live *inside* dark elements

In dark mode these invert (`primary` becomes light, `footer-bg` becomes
near-black). All other surfaces and text tokens use the CSS-variable layer.

## Demo form integration

`src/lib/api.ts` ships `submitDemoRequest(payload)` returning a tagged result:

```ts
{ status: "ok" }
{ status: "duplicate" }
{ status: "timeout" }
{ status: "error", message?: string }
```

Configure the endpoint via `.env`:

```env
VITE_DEMO_API_URL=https://api.once.uz/v1/demo-requests
VITE_DEMO_API_METHOD=POST
```

Payload (matches TZ § 11):

```json
{
  "fullName": "string",
  "companyName": "string",
  "jobTitle": "string",
  "email": "string",
  "phone": "string",
  "interestedModule": "string",
  "message": "string",
  "source": "landing-page"
}
```

Backend should respond with:
- `2xx` → success state shown
- `409` → duplicate state shown
- other → generic error toast with retry CTA

In dev (no backend wired) the request falls through to a console-logged success
so the success state stays demoable. Disable that block in `src/lib/api.ts`
before staging.

## Validation rules (TZ § 3.10)

| Field | Rule |
|---|---|
| All `required` fields | non-empty after trim |
| `email`               | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| `phone`               | `/^[+\d][\d\s().-]{6,}$/` (loose international) |

Errors are inline, `role="alert"`, focused on submit, and use `aria-invalid` +
`aria-describedby` to wire screen readers. Validation messages are localized
through `t.demo.errors.*`.

## Analytics (TZ § 10)

Every TZ-required event fires via `track(name, payload)` in `lib/analytics.ts`:

| Event | Where it fires |
|---|---|
| `page_viewed`                       | `pages/Home.tsx` `useEffect` |
| `request_demo_clicked`              | TopNav CTA, Hero CTA, PilotPlan CTA |
| `view_features_clicked`             | Hero secondary CTA |
| `form_started`                      | First keystroke / change in DemoForm |
| `form_submitted`                    | Successful submit |
| `form_submit_failed`                | Submit hits API and fails (reason flag) |
| `faq_opened`                        | FAQ accordion open with question payload |
| `fraud_section_viewed`              | IntersectionObserver in `Fraud.tsx` |
| `business_value_section_viewed`     | IntersectionObserver in `BusinessValue.tsx` |

All events push to `window.dataLayer` (GTM-ready) AND dispatch a
`CustomEvent("analytics:<name>")` so Segment / Mixpanel / Plausible / custom
beacon can subscribe without touching call sites. In dev they also log to
`console.debug`.

## SEO (TZ § 4, § 15)

`index.html` includes title, description, keywords, theme-color, Open Graph
(type, site_name, title, description, locale + 2 alternates) and Twitter card
meta. The `<title>` and `<meta name="description">` are rewritten in the
active locale by the `I18nProvider`. Add a real `/og.png` to `public/` and
uncomment the two `og:image` / `twitter:image` meta lines when art is ready.

## Accessibility (TZ § 8)

- All interactive elements are real `<button>` / `<a>` with focus-visible
  rings on the `brand-blue` token.
- Every form field has a `<label htmlFor>`; errors have `role="alert"` and
  are wired through `aria-describedby`.
- FAQ accordion implements the WAI-ARIA disclosure pattern (`aria-expanded`,
  `aria-controls`, `hidden`).
- Mobile menu, language switcher, theme toggle — all expose proper labels
  (`aria-haspopup`, `aria-expanded`, `aria-label`).
- All decorative SVG icons are `aria-hidden`.
- `prefers-reduced-motion` disables smooth scroll.

## Responsive (TZ § 7)

Tailwind breakpoints — content adapts at `sm` (640), `md` (768), `lg` (1024),
`xl` (1280). Hero scales from 80 → 60 → 48 → 36 px; feature / user grids
collapse 4-up → 2-up → 1-up; nav links collapse below `xl`, full nav controls
collapse to hamburger below `md`.

## Performance (TZ § 9)

- No images bundled — sticky-note mockup is pure CSS.
- Inter is loaded via `<link rel="preconnect">` + stylesheet from rsms.me CDN.
- Theme + locale are applied **before paint** (inline `<script>` in `index.html`).
- Production bundle: ~24.6 kB CSS / ~285.7 kB JS (~85 kB gzipped).
- Form submit uses `fetch` with `AbortController` 12 s timeout — no page reload.

## Out of scope (TZ § 13)

Not built per the TZ: admin panel, auth, payments, LMS / iSpring integration,
real RAG, backend API, full product dashboard. Visual design tokens were
inherited from the existing `tailwind.config.js` (Miro design system) as
allowed.

## Acceptance checklist (TZ § 14)

- [x] All 12 sections present
- [x] Hero explains product in one viewport
- [x] CTAs scroll to correct anchors
- [x] Demo form: validation, loading, success, error, duplicate, timeout
- [x] Mobile + desktop layouts verified
- [x] FAQ accordion keyboard-accessible
- [x] SEO meta in `index.html` (rewrites per locale)
- [x] Analytics event triggers wired to TZ § 10 list
- [x] 4-locale switcher (EN / UZ / UZ Cyrillic / RU)
- [x] Light + dark theme with system-preference fallback
- [x] Page conveys problem / solution / business value

---

## Learner & Admin Sites — coverage matrix

Both sites share the **same Tailwind tokens, theme system, i18n, auth context,
and route guards**. The structure is fully scaffolded and navigable; "real"
means the page has working UI with mock data, "stub" means it's wired into
the sidebar with a placeholder empty state. Each stub is its own export in
`pages/learner/stubs.tsx` or `pages/admin/stubs.tsx` — replacing one is
isolated work.

### Learner Site (TZ § 3) — 12 functional areas

| # | TZ section | Route | State |
|---|---|---|---|
| 3.1  | Authentication        | `/login` (signs in via AuthProvider) | ✅ real |
| 3.2  | Dashboard             | `/learner`                            | ✅ real (stats, progress, sticky next, skills, notifications) |
| 3.3  | Learning plan         | `/learner/plans` + `/learner/plans/:id` + `/learner/plans/:id/modules/:moduleId` | ✅ real |
| 3.4  | AI assistant          | `/learner/assistant`                  | stub |
| 3.5  | Content viewer        | `/learner/plans/:id/modules/:mid/lessons/:lid` | ✅ real (text + checklist + video stub + mark-complete) |
| 3.6  | Mock playground       | `/learner/playground`                 | stub |
| 3.7  | Client trainer        | `/learner/dialog`                     | stub |
| 3.8  | Fraud simulator       | `/learner/fraud`                      | stub |
| 3.9  | Quiz / assessment     | (within module flow)                  | stub |
| 3.10 | Progress              | `/learner/progress`                   | stub |
| 3.11 | Notifications         | `/learner/notifications` (also surfaces on dashboard) | stub |
| 3.12 | Feedback              | `/learner/settings`                   | stub |

### Admin Site (TZ § 4) — 19 functional areas

| # | TZ section | Route | State |
|---|---|---|---|
| 4.1  | Admin authentication      | `/login` (role inference)           | ✅ real |
| 4.2  | Admin dashboard           | `/admin`                            | ✅ real (4 stats, branch readiness, audit feed, quick tiles) |
| 4.3  | User management           | `/admin/users`                      | ✅ real (search + 3 filters + paginated table + chip filters) |
| 4.4  | Org structure             | `/admin/org`                        | stub |
| 4.5  | Knowledge base            | `/admin/knowledge`                  | stub |
| 4.6  | AI assistant config       | `/admin/assistant`                  | stub |
| 4.7  | Learning plan builder     | `/admin/plans`                      | stub |
| 4.8  | Module/Lesson management  | `/admin/modules`                    | stub |
| 4.9  | Quiz management           | `/admin/quizzes`                    | stub |
| 4.10 | Mock playground scenarios | `/admin/scenarios/mock`             | stub |
| 4.11 | Fraud scenarios           | `/admin/scenarios/fraud`            | stub |
| 4.12 | Assignment management     | `/admin/assignments`                | stub |
| 4.13 | Progress monitoring       | `/admin/progress`                   | stub |
| 4.14 | Skill analytics           | `/admin/skills`                     | stub |
| 4.15 | Reports                   | `/admin/reports`                    | stub |
| 4.16 | LMS / iSpring integration | `/admin/integration`                | stub |
| 4.17 | Notification management   | `/admin/notifications`              | stub |
| 4.18 | Audit logs                | `/admin/audit`                      | stub (preview appears on dashboard) |
| 4.19 | System settings           | `/admin/settings`                   | stub |

### Roles & Permissions (TZ § 5)

`auth/permissions.ts` maps every `RoleCode` to a `Permission[]`. Two layers
enforce this in the UI:

- **Sidebar items** declare an optional `permission`; the sidebar filters
  them out via `useAuth().can(permission)`. A Content Manager logged in via
  the role switcher won't see "Audit logs" or "Users".
- **Route guards** (`<RequireRole>`) handle the higher-level zoning between
  the Learner and Admin sites. A learner navigating to `/admin/anything` is
  redirected to `/learner`.

The dev **Role switcher** in the app header bypasses the form and signs in as
any persona — wrap it in `if (import.meta.env.PROD) return null` to hide in
production.

### Mock data (TZ § 6)

`src/data/mock.ts` ships seed users, branches, departments, positions,
learning plans, modules, lessons, progress, skill scores, knowledge documents,
simulator + fraud scenarios, notifications, integration logs and audit logs.
Selectors (`getUserById`, `getPlanById`, `getProgressForUser`, …) give pages
a thin, swappable surface — replace each with a fetcher in the same shape.

### Build numbers

After scaffolding both sites:

```
dist/index.html   3.27 kB
dist/index.css   28.79 kB  (6.26 kB gzip)
dist/index.js   416.22 kB  (~120 kB gzip)
```

When the sites grow further, consider per-route lazy loading
(`React.lazy(() => import('./pages/admin/Users'))`) so a learner doesn't
download the admin bundle, and the landing page stays light.

### Next-session checklist

The foundation is stable; each follow-up session can pick one TZ entry from
the matrix above and flesh out one file (`pages/learner/Assistant.tsx`,
`pages/admin/Knowledge.tsx`, …). Suggested priority order based on demo
value:

1. **Admin Knowledge Base** (§ 4.5) — upload + status + indexing
2. **Admin Learning Plan builder** (§ 4.7) — drag-drop modules, publish
3. **Learner AI Assistant** (§ 3.4) — chat UI + citations
4. **Learner Fraud simulator** (§ 3.8) — scenario player + scoring
5. **Admin Progress monitoring** (§ 4.13) — branch / department filters
6. **Reports** (§ 4.15) — export Excel / PDF / CSV

Out-of-scope (per TZ § 10): visual redesign, framework swap, real ABS/CRM,
real customer DB, payment, full HR payroll, production AI training, voice
assistant, emotion analysis, deepfake generation.
