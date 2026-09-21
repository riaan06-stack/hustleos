# HustleOS — Phase 1

HustleOS connects **Hustlers** (students/freelancers) with **Owners**
(founders, businesses, clients). Phase 1 builds the frontend foundation:
the welcome experience, account-type selection, registration/login, and
role-specific profile onboarding — all on one responsive codebase for
mobile, tablet, and desktop.

This phase does **not** include the marketplace, projects, payments,
messaging, or analytics. Those are placeholders (visibly marked "Soon")
in the navigation, ready to be built in later phases.

---

## 1. Project overview

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4, custom black/blue design tokens
- **Motion:** Framer Motion (intro sequence, page/card transitions)
- **Forms:** React Hook Form + Zod validation
- **State:** Zustand (persisted to `localStorage`) for a mock auth/profile layer
- **Icons:** Lucide React

The whole app is one responsive codebase — there are no separate mobile
and desktop pages or components. Every screen adapts via Tailwind
breakpoints, a bottom nav on small screens, and a left sidebar on large
ones.

---

## 2. Required Node.js version

Node.js **20.x or later** (LTS) is recommended. Check your version with:

```bash
node -v
```

---

## 3. Installation

From the project root:

```bash
npm install
```

---

## 4. Starting the development server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

For a production build:

```bash
npm run build
npm run start
```

---

## 5. Available scripts

| Script          | Description                                  |
| --------------- | --------------------------------------------- |
| `npm run dev`   | Start the local dev server with hot reload    |
| `npm run build` | Create an optimized production build          |
| `npm run start` | Serve the production build                    |
| `npm run lint`  | Run ESLint over the project                   |

---

## 6. Project structure

```text
src/
├── app/
│   ├── page.tsx                     # Landing page + cinematic intro
│   ├── layout.tsx                   # Root layout, fonts, metadata
│   ├── globals.css                  # Design tokens (colors, glow, etc.)
│   ├── not-found.tsx                # 404 page
│   ├── error.tsx                    # Global error boundary
│   ├── onboarding/
│   │   ├── account-type/page.tsx    # Hustler vs Owner selection
│   │   ├── hustler/page.tsx         # Hustler profile onboarding (3 steps)
│   │   └── owner/page.tsx           # Owner profile onboarding (2 steps)
│   ├── register/page.tsx            # Registration form
│   ├── login/page.tsx               # Login form
│   └── dashboard/
│       ├── hustler/page.tsx         # Hustler dashboard placeholder
│       └── owner/page.tsx           # Owner dashboard placeholder
├── components/
│   ├── ui/                          # Button, Input, Select, Textarea, Card,
│   │                                 # Badge, ProgressBar, Modal, States
│   ├── layout/                      # PageContainer, Sidebar, BottomNav,
│   │                                 # AppShell, navConfig
│   ├── onboarding/                  # FormSection, SkillsInput
│   └── IntroSequence.tsx            # Cinematic welcome animation
├── lib/
│   ├── store/auth.ts                # Mock authentication + profile store
│   └── utils.ts                     # cn() helper, completion % calculators
├── hooks/
│   ├── useHydrated.ts               # SSR/localStorage hydration guard
│   └── useRequireAuth.ts            # Route-protection hook
└── types/index.ts                   # Shared TypeScript types
```

---

## 7. The mock authentication system

Phase 1 intentionally does **not** use Supabase or any real backend.
Instead, `src/lib/store/auth.ts` is a self-contained Zustand store,
persisted to the browser's `localStorage` under the key `hustleos-auth`.

**How it works:**

- `users` — an array of `AppUser` records (id, role, name, age, gender,
  email). This is what the rest of the app reads.
- `credentials` — a **separate** map of `email → hashed password`. Raw
  passwords are never stored, and password data is never merged into the
  `AppUser` object that UI components consume — this mirrors how a real
  backend would separate an auth table from a public profile table.
- `hustlerProfiles` / `ownerProfiles` — keyed by user id, populated by
  the onboarding flows.
- `pendingRole` — the account type chosen on the "What brings you to
  HustleOS?" screen, used to tag the account created immediately after
  on the registration screen.

**Important:** the password hashing in this file (`hashPassword`) is a
simple, non-cryptographic placeholder. It exists only so a plaintext
password is never written to `localStorage` during local development —
it is **not secure** and must not be reused in production.

All screens interact with this store only through its exported actions:
`register()`, `login()`, `logout()`, `saveHustlerProfile()`,
`saveOwnerProfile()`, and the `useCurrentUser()` / `useHustlerProfile()`
/ `useOwnerProfile()` selector hooks. No component reaches into
`localStorage` directly.

---

## 8. Connecting a real backend later

Because UI components only ever call the store's actions (never
`localStorage` or fetch calls directly), swapping in a real backend
means rewriting `src/lib/store/auth.ts` — nothing in `app/` or
`components/` needs to change, as long as the new implementation
exposes the same function signatures.

Suggested path for a future phase:

1. Replace `register`/`login` with calls to your auth provider (e.g.
   Supabase Auth, NextAuth, or a custom API) and drop the local
   `hashPassword` function entirely — real password hashing belongs on
   the server.
2. Replace the `users` / `hustlerProfiles` / `ownerProfiles` in-memory
   arrays with data fetched from your database (e.g. Supabase Postgres
   tables `users`, `hustler_profiles`, `owner_profiles`).
3. Keep the private/public data split described in the project brief:
   never expose `email`, `age`, or `gender` to other users by default —
   only the public professional fields (name, title, skills, bio,
   portfolio, experience, availability, rate) should ever be queryable
   by Owners in the future marketplace.
4. Swap Zustand's `persist` middleware for a thin API client, or keep
   Zustand as a client-side cache in front of real API calls — the hook
   shapes (`useCurrentUser()`, etc.) can stay identical.
5. Add real session handling (cookies/JWT) and move the route guards in
   `useRequireAuth.ts` to check that session instead of the local store.

---

## 9. Design system

- **Palette:** black → dark navy → blue → light blue, defined in
  `src/app/globals.css` under `@theme inline` (`--color-bg-main`,
  `--color-blue-primary`, etc.)
- **Typography:** Sora (display/headings) + Inter (body), self-hosted via
  `@fontsource` so the app builds and runs without any external font
  requests.
- **Motion:** a single cinematic intro plays once per browser (tracked
  via `hasSeenIntro` in the store), plus purposeful hover/selection/step
  transitions — nothing gratuitous.

---

## 10. Known Phase 1 limitations (by design)

- No real backend, database, or payment processing.
- Marketplace, projects, messaging, and analytics are visible only as
  disabled "Soon" navigation items.
- Password recovery is a placeholder explaining that it isn't available
  in this preview build.
- All data lives in the current browser's `localStorage` and will not
  sync across devices or survive clearing site data.
