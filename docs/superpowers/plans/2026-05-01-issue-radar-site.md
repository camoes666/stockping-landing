# Issue Radar Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Astro 기반 회사 도메인 사이트를 구축해 메인 랜딩과 `오늘의 미국장 이슈 레이더` 페이지를 제공하고, 앱 다운로드 전환을 유도한다.

**Architecture:** Astro를 정적 사이트 생성의 중심으로 사용하고, FAQ/CTA 같은 작은 상호작용은 React island로 분리한다. 콘텐츠 데이터는 초기에는 로컬 mock 데이터로 시작하고, Supabase 스키마와 연결 지점을 함께 준비해 2차 작업에서 운영 데이터로 치환할 수 있게 만든다.

**Tech Stack:** Astro, React, TypeScript, Cloudflare Pages, Supabase, Vitest, Testing Library, Playwright

---

## File Map

| Role | Path |
|------|------|
| Astro project config | `package.json`, `astro.config.mjs`, `tsconfig.json` |
| Cloudflare Pages adapter/config | `astro.config.mjs`, `wrangler.toml` |
| Base layout | `src/layouts/BaseLayout.astro` |
| Shared site config | `src/config/site.ts` |
| Shared CTA/url constants | `src/config/links.ts` |
| Radar mock content | `src/data/daily-issues.ts` |
| Home page | `src/pages/index.astro` |
| Radar page | `src/pages/radar.astro` |
| Privacy page | `src/pages/privacy.astro` |
| Terms page | `src/pages/terms.astro` |
| Shared header/footer | `src/components/site/SiteHeader.astro`, `src/components/site/SiteFooter.astro` |
| CTA button UI | `src/components/ui/CtaButton.tsx` |
| Issue card UI | `src/components/radar/IssueCard.astro` |
| FAQ interactive island | `src/components/islands/FaqAccordion.tsx` |
| Supabase client stub | `src/lib/supabase.ts` |
| Analytics helpers | `src/lib/analytics.ts` |
| Unit tests | `src/components/**/*.test.ts`, `src/lib/**/*.test.ts` |
| E2E tests | `e2e/site.spec.ts` |

---

## Task 1: Initialize Astro Project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/env.d.ts`

- [ ] **Step 1: Create Astro app in the current workspace**

Run:

```bash
npm create astro@latest . -- --template basics --install
```

Expected: Astro scaffold files appear in the repository root and install completes without creating a nested project folder.

- [ ] **Step 2: Add React integration, testing tools, and Supabase**

Run:

```bash
npm install @astrojs/react @supabase/supabase-js react react-dom
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event playwright @playwright/test
```

Expected: `package.json` contains Astro, React, testing, and Supabase dependencies. Cloudflare Pages serves the `dist/` folder directly for static output — no adapter needed.

- [ ] **Step 3: Configure Astro for React (static output)**

Update `astro.config.mjs`:

```javascript
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  integrations: [react()],
  output: "static",
});
```

- [ ] **Step 4: Add scripts for development, build, preview, tests, and E2E**

Update `package.json` scripts:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 5: Verify the project boots**

Run:

```bash
npm run build
```

Expected: Astro completes type checks and produces a build output with no fatal errors.

---

## Task 2: Establish Shared Site Configuration

**Files:**
- Create: `src/config/site.ts`
- Create: `src/config/links.ts`
- Test: `src/config/site.test.ts`

- [ ] **Step 1: Write the failing config test**

Create `src/config/site.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { siteConfig } from "./site";
import { links } from "./links";

describe("site configuration", () => {
  it("defines the radar page title", () => {
    expect(siteConfig.radarPageTitle).toBe("오늘의 미국장 이슈 레이더");
  });

  it("contains a Play Store url placeholder", () => {
    expect(links.playStore).toContain("play.google.com");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm run test -- src/config/site.test.ts
```

Expected: FAIL because `site.ts` and `links.ts` do not exist yet.

- [ ] **Step 3: Implement the shared configuration**

Create `src/config/site.ts`:

```typescript
export const siteConfig = {
  siteName: "회사명",
  defaultTitle: "미국장 정보와 이슈를 더 빠르게 보는 방법",
  defaultDescription:
    "미국장 핵심 이슈를 확인된 사실과 시장 관측으로 나눠 보고, 앱에서 더 자세한 데이터를 확인하세요.",
  radarPageTitle: "오늘의 미국장 이슈 레이더",
  radarDisclaimer:
    "루머성 이슈는 확인된 사실과 시장 관측을 구분해 제공합니다. 본 페이지는 투자 판단을 돕기 위한 정보 제공 목적이며, 특정 종목의 매수·매도 추천이 아닙니다.",
} as const;
```

Create `src/config/links.ts`:

```typescript
export const links = {
  playStore: "https://play.google.com/store/apps/details?id=YOUR_APP_ID",
  companyDomain: "https://www.example.com",
} as const;
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
npm run test -- src/config/site.test.ts
```

Expected: PASS with 2 tests passed.

---

## Task 3: Create Layout, Header, Footer, and CTA UI

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/site/SiteHeader.astro`
- Create: `src/components/site/SiteFooter.astro`
- Create: `src/components/ui/CtaButton.tsx`  ← React 컴포넌트 (Vitest로 단위 테스트 가능)
- Test: `src/components/ui/CtaButton.test.tsx`

- [ ] **Step 1: Write the failing CTA component test**

Create `src/components/ui/CtaButton.test.tsx`:

```typescript
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { CtaButton } from "./CtaButton";

describe("CtaButton", () => {
  it("renders the label text", () => {
    render(<CtaButton href="https://example.com" label="앱에서 자세히 보기" />);
    expect(screen.getByRole("link", { name: "앱에서 자세히 보기" })).toBeInTheDocument();
  });

  it("sets href, target, and rel correctly", () => {
    render(<CtaButton href="https://play.google.com/store" label="앱 받기" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://play.google.com/store");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm run test -- src/components/ui/CtaButton.test.tsx
```

Expected: FAIL — `Cannot find module './CtaButton'`

- [ ] **Step 3: Implement the shared UI shell**

Create `src/components/ui/CtaButton.tsx`:

```typescript
interface Props {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
}

const styles = {
  primary:
    "inline-flex items-center justify-center rounded-md bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700",
  secondary:
    "inline-flex items-center justify-center rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50",
};

export function CtaButton({ href, label, variant = "primary" }: Props) {
  return (
    <a href={href} className={styles[variant]} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  );
}
```

Astro 페이지에서 React island로 사용:

```astro
---
import { CtaButton } from "../components/ui/CtaButton";
---
<CtaButton client:load href={links.playStore} label="플레이스토어에서 앱 받기" />
```

Create `src/components/site/SiteHeader.astro`:

```astro
---
import { siteConfig } from "../../config/site";
---

<header class="border-b border-slate-200 bg-white">
  <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
    <a href="/" class="text-sm font-semibold text-slate-900">{siteConfig.siteName}</a>
    <nav class="flex items-center gap-4 text-sm text-slate-600">
      <a href="/radar">이슈 레이더</a>
      <a href="/privacy">개인정보처리방침</a>
    </nav>
  </div>
</header>
```

Create `src/components/site/SiteFooter.astro`:

```astro
---
import { siteConfig } from "../../config/site";
---

<footer class="border-t border-slate-200 bg-white">
  <div class="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500">
    <p>{siteConfig.siteName}</p>
    <p class="mt-2">본 사이트의 정보는 투자 판단을 돕기 위한 정보 제공 목적입니다.</p>
  </div>
</footer>
```

Create `src/layouts/BaseLayout.astro`:

```astro
---
import SiteHeader from "../components/site/SiteHeader.astro";
import SiteFooter from "../components/site/SiteFooter.astro";

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---

<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body class="bg-white text-slate-900">
    <SiteHeader />
    <main>
      <slot />
    </main>
    <SiteFooter />
  </body>
</html>
```

- [ ] **Step 4: Run the CTA test to verify it passes**

Run:

```bash
npm run test -- src/components/ui/CtaButton.test.tsx
```

Expected: PASS with 2 tests passed.

---

## Task 4: Add Radar Content Data and Issue Card Component

**Files:**
- Create: `src/data/daily-issues.ts`
- Create: `src/components/radar/IssueCard.astro`
- Test: `src/data/daily-issues.test.ts`

- [ ] **Step 1: Write the failing content test**

Create `src/data/daily-issues.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { dailyIssues } from "./daily-issues";

describe("daily issues data", () => {
  it("contains between 3 and 5 issues", () => {
    expect(dailyIssues.length).toBeGreaterThanOrEqual(3);
    expect(dailyIssues.length).toBeLessThanOrEqual(5);
  });

  it("keeps confirmed facts separate from market observations", () => {
    expect(dailyIssues[0].confirmedFacts.length).toBeGreaterThan(0);
    expect(dailyIssues[0].marketObservation.length).toBeGreaterThan(0);
  });

  it("watchPoints and appDataPoints are arrays with at least one item", () => {
    dailyIssues.forEach((issue) => {
      expect(Array.isArray(issue.watchPoints)).toBe(true);
      expect(issue.watchPoints.length).toBeGreaterThan(0);
      expect(Array.isArray(issue.appDataPoints)).toBe(true);
      expect(issue.appDataPoints.length).toBeGreaterThan(0);
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm run test -- src/data/daily-issues.test.ts
```

Expected: FAIL because `daily-issues.ts` does not exist yet.

- [ ] **Step 3: Implement issue data and card rendering**

Create `src/data/daily-issues.ts`:

```typescript
export type IssueCategory = "확인된 사실" | "시장 관측" | "루머";

export interface DailyIssue {
  headline: string;
  category: IssueCategory;
  relatedSymbols: string[];
  confirmedFacts: string;
  marketObservation: string;
  watchPoints: string[];      // 복수 — 목업의 다중 항목 구조 반영
  appDataPoints: string[];    // 복수 — Supabase 스펙의 investor_watchpoints 배열과 일치
  ctaLabel: string;
}

export const dailyIssues: DailyIssue[] = [
  {
    headline: "반도체 대형주 실적 기대가 기술주 전체 심리에 미치는 영향",
    category: "시장 관측",
    relatedSymbols: ["NVDA", "AMD", "SMH"],
    confirmedFacts: "주요 반도체 종목을 중심으로 실적 발표 일정과 시장 관심이 집중되고 있다.",
    marketObservation: "단기 수급이 실적 기대감에 선반영되며 섹터 전반 변동성이 커질 수 있다는 해석이 나온다.",
    watchPoints: [
      "실적 일정 전후 ETF 자금 흐름을 확인한다.",
      "섹터 동반 움직임이 지속되는지 장중에 체크한다.",
    ],
    appDataPoints: ["뉴스 번역", "관련 ETF 흐름", "종목별 이슈 묶음"],
    ctaLabel: "앱에서 자세히 보기",
  },
  {
    headline: "정책 발언 이후 금리 민감 성장주의 반응 체크",
    category: "확인된 사실",
    relatedSymbols: ["QQQ", "TSLA", "AAPL"],
    confirmedFacts: "정책 발언과 경제 일정이 공개되어 시장 금리 기대에 영향을 주고 있다.",
    marketObservation: "성장주 밸류에이션 부담이 다시 부각될 수 있다는 관측이 있다.",
    watchPoints: [
      "장 초반 금리 방향성이 장중에 유지되는지 확인한다.",
      "기술주 반응이 섹터 전반으로 번지는지 체크한다.",
    ],
    appDataPoints: ["거시 이슈 요약", "관련 종목 뉴스", "ETF 흐름"],
    ctaLabel: "앱에서 자세히 보기",
  },
  {
    headline: "특정 종목 공급 계약설이 관련 밸류체인에 미치는 파급",
    category: "루머",
    relatedSymbols: ["PLTR", "MSFT"],
    confirmedFacts: "공식 공시나 회사 발표 기준 확정된 계약 내용은 아직 확인되지 않았다.",
    marketObservation: "시장에서는 수혜 가능 업종과 연관 종목을 묶어 먼저 반응하려는 움직임이 보인다.",
    watchPoints: [
      "거래량 급증 여부를 먼저 확인한다.",
      "후속 확인 보도 유무를 루머와 분리해서 본다.",
    ],
    appDataPoints: ["실시간 이슈 요약", "관련 뉴스 묶음", "종목 관심 등록"],
    ctaLabel: "앱에서 자세히 보기",
  },
];
```

Create `src/components/radar/IssueCard.astro`:

```astro
---
import type { DailyIssue } from "../../data/daily-issues";
import { CtaButton } from "../ui/CtaButton";
import { links } from "../../config/links";

interface Props {
  issue: DailyIssue;
}

const { issue } = Astro.props;
---

<article class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
  <div class="mb-4 flex flex-wrap items-center gap-3">
    <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
      {issue.category}
    </span>
    <span class="text-xs text-slate-500">관련 종목: {issue.relatedSymbols.join(", ")}</span>
  </div>

  <h2 class="text-xl font-semibold text-slate-900">{issue.headline}</h2>

  <dl class="mt-5 space-y-4 text-sm leading-6 text-slate-700">
    <div>
      <dt class="font-semibold text-slate-900">확인된 사실</dt>
      <dd>{issue.confirmedFacts}</dd>
    </div>
    <div>
      <dt class="font-semibold text-slate-900">시장 관측</dt>
      <dd>{issue.marketObservation}</dd>
    </div>
    <div>
      <dt class="font-semibold text-slate-900">투자자가 볼 포인트</dt>
      <dd>
        <ul class="mt-1 list-disc list-inside space-y-1">
          {issue.watchPoints.map((point) => <li>{point}</li>)}
        </ul>
      </dd>
    </div>
    <div>
      <dt class="font-semibold text-slate-900">앱에서 확인 가능한 데이터</dt>
      <dd class="flex flex-wrap gap-2 mt-1">
        {issue.appDataPoints.map((point) => (
          <span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{point}</span>
        ))}
      </dd>
    </div>
  </dl>

  <div class="mt-6">
    <CtaButton href={links.playStore} label={issue.ctaLabel} />
  </div>
</article>
```

- [ ] **Step 4: Run the data test to verify it passes**

Run:

```bash
npm run test -- src/data/daily-issues.test.ts
```

Expected: PASS with 2 tests passed.

---

## Task 5: Build the Main Landing Page

**Files:**
- Create: `src/pages/index.astro`
- Test: `e2e/site.spec.ts`

- [ ] **Step 1: Write the failing E2E assertion for the home page**

Create `e2e/site.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";

test("home page shows the radar entry CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /미국장 정보와 이슈/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /이슈 레이더 보기/i })).toBeVisible();
});
```

- [ ] **Step 2: Run the E2E test to verify it fails**

Run:

```bash
npm run test:e2e -- e2e/site.spec.ts
```

Expected: FAIL because the home page content does not exist yet.

- [ ] **Step 3: Implement the home page**

Create `src/pages/index.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import { CtaButton } from "../components/ui/CtaButton";
import { siteConfig } from "../config/site";
import { links } from "../config/links";
---

<BaseLayout title={siteConfig.defaultTitle} description={siteConfig.defaultDescription}>
  <section class="mx-auto max-w-6xl px-4 py-20">
    <div class="max-w-3xl">
      <p class="text-sm font-semibold text-slate-500">미국장 핵심 이슈 정리</p>
      <h1 class="mt-4 text-4xl font-bold tracking-normal text-slate-900 sm:text-5xl">
        미국장 정보와 이슈를 더 빠르게 보는 방법
      </h1>
      <p class="mt-6 text-lg leading-8 text-slate-600">
        쇼츠에서 본 이슈를 사실과 시장 관측으로 나눠 보고, 앱에서 더 깊은 데이터로 이어지세요.
      </p>
      <div class="mt-8 flex flex-wrap gap-4">
        <a href="/radar" class="inline-flex items-center justify-center rounded-md bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
          이슈 레이더 보기
        </a>
        <CtaButton client:load href={links.playStore} label="플레이스토어에서 앱 받기" variant="secondary" />
      </div>
      {/* iOS 사용자 안내 — 아이폰에서 Play Store 링크는 동작하지 않음 */}
      <p class="mt-3 text-xs text-slate-400">현재 Android(구글 플레이) 전용입니다. iOS 버전은 준비 중입니다.</p>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 4: Run the E2E test to verify it passes**

Run:

```bash
npm run test:e2e -- e2e/site.spec.ts
```

Expected: PASS for the home page assertion.

---

## Task 6: Build the Radar Page

**Files:**
- Create: `src/pages/radar.astro`
- Test: `e2e/site.spec.ts`

- [ ] **Step 1: Extend the E2E test with radar page assertions**

Append to `e2e/site.spec.ts`:

```typescript
test("radar page shows 3 issue cards and a disclaimer", async ({ page }) => {
  await page.goto("/radar");
  await expect(page.getByRole("heading", { name: "오늘의 미국장 이슈 레이더" })).toBeVisible();
  await expect(page.getByText("확인된 사실")).toBeVisible();
  await expect(page.getByText("시장 관측")).toBeVisible();
  await expect(page.getByText("투자자가 볼 포인트")).toBeVisible();
  // 인라인 disclaimer가 카드 바로 아래에 보여야 함 (footer까지 스크롤 불필요)
  await expect(page.getByText(/특정 종목의 매수·매도 추천이 아닙니다/).first()).toBeVisible();
});

test("iOS notice is visible near Play Store CTA without scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); // iPhone 14
  await page.goto("/");
  await expect(page.getByText(/Android.*전용/)).toBeVisible();
});
```

- [ ] **Step 2: Run the E2E test to verify it fails**

Run:

```bash
npm run test:e2e -- e2e/site.spec.ts
```

Expected: FAIL because `/radar` does not exist yet.

- [ ] **Step 3: Implement the radar page**

Create `src/pages/radar.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import IssueCard from "../components/radar/IssueCard.astro";
import { CtaButton } from "../components/ui/CtaButton";
import { dailyIssues } from "../data/daily-issues";
import { siteConfig } from "../config/site";
import { links } from "../config/links";
---

<BaseLayout title={siteConfig.radarPageTitle} description={siteConfig.defaultDescription}>
  <section class="border-b border-slate-200 bg-slate-50">
    <div class="mx-auto max-w-6xl px-4 py-16">
      <p class="text-sm font-semibold text-slate-500">오늘 시장에서 많이 언급되는 이슈 정리</p>
      <h1 class="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">{siteConfig.radarPageTitle}</h1>
      <p class="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
        오늘 미국장에서 많이 언급되는 이슈를 확인된 사실과 시장 관측으로 나눠 빠르게 확인하세요.
      </p>
      <div class="mt-8">
        <CtaButton client:load href={links.playStore} label="플레이스토어에서 앱 받기" />
      </div>
      {/* iOS 사용자 안내 */}
      <p class="mt-3 text-xs text-slate-400">현재 Android(구글 플레이) 전용입니다. iOS 버전은 준비 중입니다.</p>
    </div>
  </section>

  <section class="mx-auto max-w-6xl px-4 py-12">
    <div class="grid gap-6">
      {dailyIssues.map((issue) => <IssueCard issue={issue} />)}
    </div>

    {/* 인라인 disclaimer — 이슈 카드 직후 배치. 쇼츠 유입 사용자는 footer까지 스크롤하지 않음 */}
    <div class="mt-8 rounded-lg border border-amber-200 bg-amber-50 px-5 py-4 text-xs leading-6 text-amber-800">
      {siteConfig.radarDisclaimer}
    </div>
  </section>

  <section class="mx-auto max-w-6xl px-4 pb-20">
    <div class="rounded-lg bg-slate-100 p-6 text-sm leading-7 text-slate-500">
      <p>{siteConfig.radarDisclaimer}</p>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 4: Run the E2E test to verify it passes**

Run:

```bash
npm run test:e2e -- e2e/site.spec.ts
```

Expected: PASS for both home and radar page assertions.

---

## Task 7: Add Legal Pages

**Files:**
- Create: `src/pages/privacy.astro`
- Create: `src/pages/terms.astro`

- [ ] **Step 1: Create a basic privacy page**

Create `src/pages/privacy.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="개인정보처리방침" description="개인정보처리방침">
  <section class="mx-auto max-w-4xl px-4 py-16">
    <h1 class="text-3xl font-bold text-slate-900">개인정보처리방침</h1>
    <p class="mt-6 text-base leading-7 text-slate-600">
      본 페이지는 정식 정책 문안으로 교체되기 전까지 기본 구조를 제공하기 위한 초안입니다.
    </p>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Create a basic terms page**

Create `src/pages/terms.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="이용안내" description="이용안내">
  <section class="mx-auto max-w-4xl px-4 py-16">
    <h1 class="text-3xl font-bold text-slate-900">이용안내</h1>
    <p class="mt-6 text-base leading-7 text-slate-600">
      본 사이트는 투자 판단을 돕기 위한 정보 제공 페이지이며, 특정 종목의 매수·매도 추천을 제공하지 않습니다.
    </p>
  </section>
</BaseLayout>
```

- [ ] **Step 3: Verify the legal pages render in development**

Run:

```bash
npm run dev
```

Expected: `/privacy` and `/terms` both open without route errors.

---

## Task 8: Prepare Supabase Integration Boundary

**Files:**
- Create: `src/lib/supabase.ts`
- Create: `src/lib/analytics.ts`
- Test: `src/lib/analytics.test.ts`

- [ ] **Step 1: Write the failing analytics test**

Create `src/lib/analytics.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { buildCtaEvent } from "./analytics";

describe("buildCtaEvent", () => {
  it("normalizes CTA metadata", () => {
    expect(
      buildCtaEvent({
        sourcePage: "radar",
        sourceSection: "issue-card",
        campaign: "tiktok",
      })
    ).toEqual({
      sourcePage: "radar",
      sourceSection: "issue-card",
      campaign: "tiktok",
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm run test -- src/lib/analytics.test.ts
```

Expected: FAIL because `analytics.ts` does not exist yet.

- [ ] **Step 3: Supabase 대시보드에서 RLS 정책 설정 (코드 작성 전 선행)**

anon key가 공개되므로, 클라이언트 코드 작성 전에 Supabase 대시보드 → Table Editor → RLS에서 아래 정책을 반드시 적용한다.

| 테이블 | anon 권한 | 정책 조건 |
|--------|-----------|-----------|
| `daily_issues` | SELECT | `status = 'published'` 행만 허용 |
| `daily_issue_sets` | SELECT | `status = 'published'` 행만 허용 |
| `cta_events` | INSERT | 조건 없음 (row 삽입만 허용) |
| `cta_events` | SELECT | 거부 (anon은 읽기 불가) |

SQL 예시:

```sql
-- daily_issues: published 행만 읽기 허용
create policy "anon can read published issues"
  on daily_issues for select
  to anon
  using (status = 'published');

-- cta_events: anon은 삽입만 허용
create policy "anon can insert cta events"
  on cta_events for insert
  to anon
  with check (true);
```

RLS 미적용 상태로 배포하면 draft 콘텐츠 노출 및 임의 행 삭제가 가능하므로, 이 단계를 건너뛰면 안 된다.

- [ ] **Step 4: Implement the Supabase boundary**

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
```

Create `src/lib/analytics.ts`:

```typescript
export interface CtaEvent {
  sourcePage: string;
  sourceSection: string;
  campaign?: string;
}

export function buildCtaEvent(event: CtaEvent): CtaEvent {
  return {
    sourcePage: event.sourcePage,
    sourceSection: event.sourceSection,
    campaign: event.campaign,
  };
}
```

- [ ] **Step 5: Run the analytics test to verify it passes**

Run:

```bash
npm run test -- src/lib/analytics.test.ts
```

Expected: PASS with 1 test passed.

---

## Task 9: Configure Cloudflare Pages Deployment

**Files:**
- Create: `wrangler.toml`
- Modify: `package.json`

- [ ] **Step 1: Add Cloudflare configuration**

Create `wrangler.toml`:

```toml
name = "issue-radar-site"
compatibility_date = "2026-05-01"

[assets]
directory = "./dist"
```

- [ ] **Step 2: Add deployment notes to package scripts if needed**

Update `package.json` with:

```json
{
  "scripts": {
    "cf:preview": "wrangler pages dev ./dist"
  }
}
```

- [ ] **Step 3: Verify build output exists for Pages**

Run:

```bash
npm run build
```

Expected: build completes and produces deployable output for Cloudflare.

---

## Task 10: Final Verification

**Files:**
- No code changes required

- [ ] **Step 1: Run the unit tests**

Run:

```bash
npm run test
```

Expected: PASS for config, data, and analytics tests.

- [ ] **Step 2: Run the E2E tests**

Run:

```bash
npm run test:e2e
```

Expected: PASS for home page and radar page flows.

- [ ] **Step 3: Run the production build**

Run:

```bash
npm run build
```

Expected: PASS with no Astro type errors or Cloudflare adapter failures.

- [ ] **Step 4: Replace launch placeholders before release**

Update:

```typescript
// src/config/site.ts
siteName: "회사명"

// src/config/links.ts
playStore: "https://play.google.com/store/apps/details?id=YOUR_APP_ID"
companyDomain: "https://www.example.com"
```

Expected: real production values are set before deployment.

- [ ] **Step 5: Deploy to Cloudflare Pages and bind the company domain**

Run the Cloudflare Pages deployment flow for the repository and connect the company domain in the Pages project settings.

Expected: production site opens on the company domain and `/radar` resolves correctly.

---

## Phase 2 Follow-Up

- Add `/blog` and `/blog/[slug]` routes in the same Astro codebase
- Replace mock issue data with Supabase-managed content fetch
- Add CTA event persistence
- Add OG image generation or per-page social previews
