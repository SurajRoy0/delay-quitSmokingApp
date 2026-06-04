# 🔍 Delay App — Full Project Audit

## Overall Progress: ~40% Complete

The foundation is solid — auth, schema, onboarding, and the core dashboard loop work. But there are **critical bugs**, **hardcoded values**, **missing features**, and **production blockers** that need to be resolved.

---

## 🟢 What's Working

| Area | Status | Notes |
|---|---|---|
| **Prisma Schema** | ✅ Complete | Well-designed with chains, gap sessions, craving events, subscriptions |
| **Auth (Better Auth + Google OAuth)** | ✅ Working | Server + client setup, catch-all API route, session management |
| **Onboarding Flow** | ✅ Working | Multi-step dialog, saves to DB in transaction, creates UserStats |
| **Landing Page** | ✅ Good | Clean hero, CTA, theme toggle |
| **Login Page** | ✅ Good | Google sign-in, loading states, polished UI |
| **Home Dashboard (basic)** | ✅ Partial | Timer, circular progress, challenge stack, stats cards |
| **Health Timeline** | ✅ Partial | Milestone cards with progress indicators |
| **Profile Page** | ✅ Partial | User info, smoking profile, theme toggle, billing section |
| **Bottom Nav** | ✅ Working | Mobile dock + desktop top nav, responsive |
| **Theme System** | ✅ Working | Dark/light/system via next-themes |
| **Confirmation Modal** | ✅ Working | "Keep Going" / "I Smoked" dialog per product spec |
| **Server Actions** | ✅ Working | `logSmokeEvent`, `getCurrentSession`, `getCompletedChallenges`, `getUserStats`, `getUserProfile` |

---

## 🔴 Critical Bugs

### 1. Broken Route: `/dashboard` Does Not Exist
**Severity: CRITICAL — Auth flow is broken**

Multiple places redirect to `/dashboard`, but this route doesn't exist. The actual app lives at `/home`.

| File | Line | Issue |
|---|---|---|
| [login/page.tsx](file:///Users/joyitsolutions/Desktop/Suraj/i-can/src/app/(auth)/login/page.tsx#L16-L17) | 16-17 | `callbackURL: "/dashboard"` and `newUserCallbackURL: "/dashboard"` |
| [page.tsx (landing)](file:///Users/joyitsolutions/Desktop/Suraj/i-can/src/app/page.tsx#L34) | 34, 84 | `<Link href="/dashboard">` |
| [proxy.ts](file:///Users/joyitsolutions/Desktop/Suraj/i-can/src/proxy.ts#L17) | 17, 21 | Redirects to/protects `/dashboard` |

**Fix**: Change all `/dashboard` references to `/home`.

---

### 2. `ember-*` Colors Are Undefined
**Severity: HIGH — Visual breakage on landing + login pages**

The landing page and login page use `ember-1`, `ember-2`, `ember-3` color tokens (e.g., `bg-ember-1`, `from-ember-1 to-ember-3`), but these are **never defined** in [globals.css](file:///Users/joyitsolutions/Desktop/Suraj/i-can/src/app/globals.css). Only `brand`, `brand-dark`, and `brand-light` are defined.

Components affected:
- [page.tsx (landing)](file:///Users/joyitsolutions/Desktop/Suraj/i-can/src/app/page.tsx) — gradient text, badge dot, logo
- [login/page.tsx](file:///Users/joyitsolutions/Desktop/Suraj/i-can/src/app/(auth)/login/page.tsx) — conic gradient, logo, loader, stats
- [onboarding-dialog.tsx](file:///Users/joyitsolutions/Desktop/Suraj/i-can/src/components/onboarding-dialog.tsx#L111) — logo gradient
- [log-smoke-button.tsx](file:///Users/joyitsolutions/Desktop/Suraj/i-can/src/components/log-smoke-button.tsx#L38) — border/text colors
- [gap-timer.tsx](file:///Users/joyitsolutions/Desktop/Suraj/i-can/src/components/gap-timer.tsx#L86) — SVG stroke

**Fix**: Add `ember-1`, `ember-2`, `ember-3` to the `@theme inline` block, or migrate all `ember-*` references to the existing `brand-*` tokens.

---

### 3. Proxy (`proxy.ts`) Doesn't Protect `/home` or `/health`
**Severity: HIGH — Unauthenticated access possible**

The proxy (middleware) only protects `/dashboard`, `/progress`, and `/profile`. It does **not** protect `/home` or `/health`, which are the actual app routes.

**Fix**: Update [proxy.ts](file:///Users/joyitsolutions/Desktop/Suraj/i-can/src/proxy.ts) to protect `/home` and `/health` (or better: protect all routes except `/`, `/login`, and `/api/auth`).

---

### 4. Health Page Has Hardcoded Minutes
**Severity: HIGH — Feature is non-functional**

[health/page.tsx](file:///Users/joyitsolutions/Desktop/Suraj/i-can/src/app/(app)/health/page.tsx#L12) line 12:
```typescript
const currentMinutes = 409; // Mocking 6h 49m
```
This means the health timeline is **always showing the same progress** regardless of the user's actual smoke-free time.

**Fix**: Calculate `currentMinutes` from the active gap session's `startedAt` timestamp.

---

### 5. Home Page Timer Doesn't Live-Update
**Severity: MEDIUM — Poor UX, timer appears frozen**

The [home page](file:///Users/joyitsolutions/Desktop/Suraj/i-can/src/app/(app)/home/page.tsx) is a **server component**. The timer values (`smokeFreeFor`, `progressValue`) are computed once on the server and never update on the client. The user sees a static timestamp.

There's already a [GapTimer](file:///Users/joyitsolutions/Desktop/Suraj/i-can/src/components/gap-timer.tsx) client component that does live ticking, but **it's not used anywhere**.

**Fix**: Pass `startedAt` and `targetMinutes` to a client component wrapper that ticks every second.

---

### 6. `logSmokeEvent` Not Wrapped in a Transaction
**Severity: MEDIUM — Data corruption risk**

[smoking.ts logSmokeEvent()](file:///Users/joyitsolutions/Desktop/Suraj/i-can/src/actions/smoking.ts#L141-L232) performs 5 sequential DB operations (end session → find prev log → create smoke log → create gap session → upsert stats) **without a transaction**. If any step fails mid-way, the database will be in an inconsistent state.

**Fix**: Wrap the entire `logSmokeEvent` body in `prisma.$transaction()`.

---

### 7. Profile Page Has Hardcoded Values
**Severity: MEDIUM**

[profile/page.tsx](file:///Users/joyitsolutions/Desktop/Suraj/i-can/src/app/(app)/profile/page.tsx):
- Line 17: Hardcoded `🏆 11h 24m` instead of fetching from user stats
- Line 105: Hardcoded `Renews Oct 12, 2024` instead of reading from subscription data
- Line 140: Hardcoded `Version 2.4.1 (882)` — should be dynamic or removed

---

### 8. Duplicate/Unused Components
**Severity: LOW**

- [log-smoke-button.tsx](file:///Users/joyitsolutions/Desktop/Suraj/i-can/src/components/log-smoke-button.tsx) — Uses the old API route pattern (`fetch("/api/smoke-log")`), but this route **doesn't exist**. The current flow uses the server action `logSmokeEvent` via [confirm-button.tsx](file:///Users/joyitsolutions/Desktop/Suraj/i-can/src/app/(app)/home/confirm-button.tsx). This component is dead code.
- [gap-timer.tsx](file:///Users/joyitsolutions/Desktop/Suraj/i-can/src/components/gap-timer.tsx) — Not imported anywhere. Should be integrated into the home page.
- [sign-out-button.tsx](file:///Users/joyitsolutions/Desktop/Suraj/i-can/src/components/sign-out-button.tsx) — Not imported anywhere. Profile page has a plain `<button>` that does nothing.

---

## 🟡 Moderate Issues

### 9. Money Saved Shows `$` Instead of User's Currency
[home/page.tsx](file:///Users/joyitsolutions/Desktop/Suraj/i-can/src/app/(app)/home/page.tsx#L67) line 67: `${stats.totalSaved}` always shows `$`. Should use the user's selected currency symbol (INR → ₹, EUR → €, etc.).

### 10. "Saved Today" Label Is Misleading
The `totalSaved` value is calculated as **lifetime** savings since join, not daily. The label says "Saved Today".

### 11. Profile Settings Are Read-Only
The profile page shows smoking profile values (daily cigarettes, price, gap target) with `ChevronRight` suggesting they're editable, but they are **not clickable** and have no edit functionality.

### 12. Sign Out Button Doesn't Work
The profile page's "Sign Out" button is a plain `<button>` with no `onClick`. The working [SignOutButton](file:///Users/joyitsolutions/Desktop/Suraj/i-can/src/components/sign-out-button.tsx) component exists but isn't used.

### 13. Onboarding Doesn't Start Initial Gap Session
After completing onboarding, the user sees `"00h 00m 00s"` and `"No Goal / START A SESSION"`. The onboarding doesn't create the first smoke log or gap session. Per the product spec, the first "I Smoked" press should start the flow, but the UX is confusing — there's no prompt or CTA to log the first smoke.

### 14. No `SmokingReason` Capture on Logging
The [ConfirmSmokeModal](file:///Users/joyitsolutions/Desktop/Suraj/i-can/src/components/confirm-smoke-modal.tsx) has no reason picker. The schema supports `SmokingReason` enum (STRESS, WORK, BOREDOM, etc.) and the product spec mentions saving the smoking reason, but it's never collected.

---

## 🔵 Missing Features (Per product.md)

| Feature | Status | Priority |
|---|---|---|
| **Session Completion Screen** | ❌ Not built | HIGH — Key UX per product.md. Should show achievements before resetting. |
| **Smoking Reason Capture** | ❌ Not built | HIGH — Enum exists in schema, needs UI in confirmation modal |
| **Live-Ticking Timer** | ❌ Component exists, not wired | HIGH — `GapTimer` component unused |
| **Craving Event Tracking** | ❌ Not built | MEDIUM — Schema ready (`CravingEvent`), no UI or action |
| **Progressive Challenge Celebration** | ❌ Not built | MEDIUM — No notification/animation when challenge block is completed |
| **Edit Profile Settings** | ❌ Not built | MEDIUM — Daily cigs, price, gap target are read-only |
| **Smoke History / Analytics** | ❌ Not built | MEDIUM — No page to view past smoke logs, trends, patterns |
| **Subscription / Billing Integration** | ❌ Not built | LOW for MVP — Schema exists, UI is hardcoded placeholder |
| **FAQ & Contact Support Pages** | ❌ Not built | LOW — Links exist but lead nowhere |
| **Terms & Privacy Pages** | ❌ Not built | LOW for MVP — Login page links to `/terms` and `/privacy` |
| **PWA / Mobile Notifications** | ❌ Not built | LOW for MVP — Would be great for reminding users |

---

## 🏗️ Production Readiness Checklist

### Security
- [ ] **`.env` is committed** — The `.gitignore` has `.env*` but the file exists. Verify it's not tracked in git. **The Google OAuth secret and Better Auth secret are exposed if committed.**
- [ ] Add rate limiting to `logSmokeEvent` (spam prevention)
- [ ] Add CSRF protection (Better Auth may handle this, verify)
- [ ] Validate `DATABASE_URL` uses SSL in production (`?sslmode=require`)
- [ ] Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to production domain

### Performance
- [ ] Home page re-runs 3 server actions on every load — consider combining into one
- [ ] No caching strategy on `getCurrentSession` / `getUserStats` — every page load hits DB
- [ ] `getUserId()` is duplicated across `smoking.ts` and `user.ts` — should be centralized

### Infrastructure
- [ ] No error boundaries — unhandled errors show Next.js default error page
- [ ] No loading states on page transitions (no `loading.tsx` files)
- [ ] No `not-found.tsx` for 404 handling
- [ ] No `error.tsx` for runtime error handling
- [ ] No `manifest.json` for PWA support
- [ ] No `robots.txt` or `sitemap.xml`
- [ ] Add proper Open Graph / social meta tags

### Code Quality
- [ ] No tests (unit, integration, or e2e)
- [ ] No TypeScript strict mode verification
- [ ] Unused components should be removed (`log-smoke-button.tsx`, dead code)
- [ ] `formatDuration` is duplicated in `smoking.ts` and `user.ts`

---

## 📋 Recommended Priority Order

### Phase 1 — Fix Critical Bugs (do first)
1. Fix `/dashboard` → `/home` route mismatch everywhere
2. Add `ember-*` color tokens (or migrate to `brand-*`)
3. Fix proxy to protect `/home` and `/health`
4. Fix hardcoded `currentMinutes` in health page
5. Wire up live-ticking timer on home page

### Phase 2 — Complete Core Features
6. Build Session Completion Screen (per product.md)
7. Add SmokingReason picker to confirmation modal
8. Wrap `logSmokeEvent` in a transaction
9. Fix profile page hardcoded values + wire SignOutButton
10. Fix currency symbol display

### Phase 3 — Polish for Launch
11. Add loading/error/not-found pages
12. Add edit profile functionality
13. Build craving tracking (basic)
14. Add smoke history / analytics page
15. Create terms & privacy pages

### Phase 4 — Production Infrastructure
16. Environment variable management (remove secrets from repo)
17. Error monitoring (Sentry or similar)
18. Analytics (PostHog, Mixpanel, or similar)
19. SEO (OG images, meta, sitemap, robots)
20. PWA manifest + service worker
