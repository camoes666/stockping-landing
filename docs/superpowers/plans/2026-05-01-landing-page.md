# 미국주식 정보 앱 랜딩페이지 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 미국주식 정보 앱([앱명])의 플레이스토어 다운로드를 유도하는 8섹션 한국어 랜딩페이지를 Next.js로 구현한다.

**Architecture:** Next.js 14 App Router + static export로 빌드한다. 각 섹션은 `components/sections/` 아래 독립 컴포넌트로 분리하고, `app/page.tsx`에서 순서대로 조합한다. 모든 카피 문구와 외부 URL은 `lib/constants.ts` 한 곳에서 관리하여 앱명·스토어 링크 교체가 단일 파일 수정으로 끝나게 한다.

**Tech Stack:** Next.js 14 (App Router, `output: export`), TypeScript, Tailwind CSS v3, Pretendard 웹폰트, Jest + React Testing Library (단위), Playwright (E2E CTA 검증)

---

## File Map

| 역할 | 경로 |
|------|------|
| 상수·카피·URL 집중 관리 | `lib/constants.ts` |
| 공통 버튼 UI | `components/ui/Button.tsx` |
| 섹션 헤드라인 UI | `components/ui/SectionHeader.tsx` |
| 히어로 섹션 | `components/sections/Hero.tsx` |
| 문제 공감 섹션 | `components/sections/ProblemAgitation.tsx` |
| 솔루션 섹션 | `components/sections/Solution.tsx` |
| 신뢰 구축 섹션 | `components/sections/SocialProof.tsx` |
| 기능과 혜택 섹션 | `components/sections/Features.tsx` |
| 오퍼/가격 섹션 | `components/sections/Pricing.tsx` |
| FAQ 섹션 | `components/sections/FAQ.tsx` |
| 최종 CTA 섹션 | `components/sections/FinalCTA.tsx` |
| 페이지 조합 | `app/page.tsx` |
| 루트 레이아웃 + SEO | `app/layout.tsx` |
| 글로벌 스타일 | `app/globals.css` |
| 단위 테스트 디렉토리 | `__tests__/` |
| E2E 테스트 | `e2e/landing.spec.ts` |
| Playwright 설정 | `playwright.config.ts` |

---

## Task 1: 프로젝트 초기화

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `jest.config.ts`, `jest.setup.ts`

- [ ] **Step 1: Next.js 프로젝트 생성**

```bash
cd C:\Users\USER\code\datadnp-us-landing
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --yes
```

Expected: 파일 생성 완료 메시지, `node_modules` 폴더 생성됨

- [ ] **Step 2: static export 설정 및 Pretendard 폰트 패키지 설치**

`next.config.ts`를 아래로 교체한다:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
```

그 다음 Pretendard 설치:

```bash
npm install pretendard
```

Expected: `node_modules/pretendard` 존재

- [ ] **Step 3: Jest + React Testing Library 설치**

```bash
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event ts-jest
```

- [ ] **Step 4: jest.config.ts 생성**

```typescript
import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  transform: { "^.+\\.(ts|tsx)$": "ts-jest" },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|scss)$": "<rootDir>/__mocks__/fileMock.ts",
  },
  testPathPattern: ["__tests__/.*\\.test\\.(ts|tsx)$"],
};

export default config;
```

- [ ] **Step 5: jest.setup.ts 생성**

```typescript
import "@testing-library/jest-dom";
```

- [ ] **Step 6: CSS mock 생성**

```bash
mkdir __mocks__
```

`__mocks__/fileMock.ts`:

```typescript
const fileMock = "";
export default fileMock;
```

- [ ] **Step 7: Playwright 설치**

```bash
npm install -D @playwright/test
npx playwright install chromium
```

- [ ] **Step 8: playwright.config.ts 생성**

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://localhost:3000",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: "npm run dev",
    port: 3000,
    reuseExistingServer: true,
  },
});
```

- [ ] **Step 9: package.json 스크립트 확인**

`package.json`의 `scripts`가 아래를 포함하는지 확인하고 없으면 추가:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "test": "jest --passWithNoTests",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 10: 개발 서버 기동 확인**

```bash
npm run dev
```

Expected: `http://localhost:3000` 에서 Next.js 기본 페이지 열림

- [ ] **Step 11: 커밋**

```bash
git init
git add .
git commit -m "chore: initialize Next.js 14 project with Tailwind, Jest, Playwright"
```

---

## Task 2: 상수 파일 (lib/constants.ts)

**Files:**
- Create: `lib/constants.ts`

- [ ] **Step 1: 실패 테스트 작성**

`__tests__/constants.test.ts`:

```typescript
import { APP_NAME, PLAYSTORE_URL, COPY } from "@/lib/constants";

describe("constants", () => {
  it("APP_NAME이 비어있지 않다", () => {
    expect(APP_NAME.length).toBeGreaterThan(0);
  });

  it("PLAYSTORE_URL이 play.google.com을 포함한다", () => {
    expect(PLAYSTORE_URL).toContain("play.google.com");
  });

  it("HERO 카피가 존재한다", () => {
    expect(COPY.hero.h1).toBeTruthy();
    expect(COPY.hero.sub).toBeTruthy();
    expect(COPY.hero.cta).toBeTruthy();
    expect(COPY.hero.micro).toBeTruthy();
  });

  it("FAQ가 7개다", () => {
    expect(COPY.faq.items).toHaveLength(7);
  });

  it("FEATURES가 6개다", () => {
    expect(COPY.features.items).toHaveLength(6);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
npm test -- constants
```

Expected: FAIL — `Cannot find module '@/lib/constants'`

- [ ] **Step 3: constants.ts 구현**

`lib/constants.ts`:

```typescript
export const APP_NAME = "[앱명]";

export const PLAYSTORE_URL =
  "https://play.google.com/store/apps/details?id=YOUR_APP_ID";

export const COPY = {
  hero: {
    h1: "미국주식 정보, 한곳에서",
    sub: "뉴스·루머·리포트·ETF 분석·내부자 거래까지\n한국 투자자를 위한 미국주식 정보 대시보드",
    cta: "플레이스토어에서 무료 다운로드",
    micro: "무료 앱 · 특정 종목 추천 없음 · 투자 판단을 돕는 정보 제공 앱",
    trustBar: "앱 실제 화면 5장 미리보기",
  },
  problem: {
    title: "미국주식 투자하면서 이런 경험, 있으신가요?",
    items: [
      "미국 뉴스는 영어로 올라오는데, 번역하는 동안 이미 타이밍을 놓쳤다",
      "ETF 구성 확인하려면 야후파이낸스·ETF.com·인베스팅닷컴을 따로 열어야 했다",
      "루머인지 확인된 사실인지 구분이 안 돼서 결국 그냥 넘겼다",
      "내부자 거래나 상하원 의원 매매 데이터는 영어 사이트에서 따로 봐야 했다",
    ],
    alternativesMention:
      "야후파이낸스, 시킹알파, OpenInsider, CNBC를 오가며 정보를 조각조각 맞추고 계신가요?",
    bridge:
      "이제 다른 방법이 있습니다.\n한국 투자자가 매일 확인해야 할 미국장 정보를 한곳에 모았습니다.",
  },
  solution: {
    headline: `${APP_NAME}은 흩어진 미국주식 정보를 앱 하나에서 한눈에 확인할 수 있도록 정리합니다`,
    before:
      "뉴스·루머·ETF·리포트·내부자 거래를 7개 사이트에서 영어로 각각 확인",
    after: "앱 하나에서 오늘의 미국장 핵심 정보를 한국어로 한 화면에 확인",
    steps: [
      "오늘의 미국장 이슈 확인",
      "루머·리포트·ETF·내부자 거래 분석",
      "관심종목 등록 후 매일 팔로우",
    ],
    diff: "야후파이낸스·시킹알파는 영어 중심이지만, [앱명]은 한국 투자자 눈높이에 맞춰 뉴스·루머·ETF·내부자 거래를 한국어로 한 앱에서 제공합니다.",
  },
  socialProof: {
    headline: "왜 지금 믿어도 되는가",
    dataSource:
      "뉴스·루머·리포트·ETF 데이터는 미국 현지 공식 소스 및 SEC 공시를 기반으로 제공합니다.",
    before: "7개 사이트를 오가며 30분 이상 소요",
    after: "앱 하나에서 5분 안에 오늘의 미국장 핵심 확인",
    disclaimer:
      "[앱명]은 특정 종목 추천이 아닌, 투자 판단을 위한 정보 수집 도구입니다. 수익 보장이나 매수·매도 추천은 제공하지 않습니다.",
  },
  features: {
    headline: "[앱명]에서 당신이 얻게 될 것들",
    items: [
      {
        icon: "📰",
        title: "실시간 미국주식 뉴스 번역",
        benefit:
          "영어 뉴스를 따로 번역하지 않아도, 미국 현지 이슈를 한국어로 빠르게 확인합니다",
      },
      {
        icon: "🔍",
        title: "루머 vs 확인된 사실 구분",
        benefit:
          "미국장에 도는 루머를 그대로 믿지 않아도 됩니다. 확인된 사실과 시장 관측을 나눠볼 수 있습니다",
      },
      {
        icon: "📊",
        title: "ETF 네비게이터",
        benefit:
          "QQQ·SCHD·SPY 등 ETF 이름만 보는 것이 아니라, 보유 종목·배당·수수료·포트폴리오 구조까지 한눈에 확인합니다",
      },
      {
        icon: "📈",
        title: "애널리스트 리포트 & 목표가",
        benefit:
          "흩어진 증권사 리포트와 목표가 변화를 한곳에 모아, 시장 컨센서스를 빠르게 파악합니다",
      },
      {
        icon: "🏛️",
        title: "내부자 거래 & 상하원 의원 매매",
        benefit:
          "OpenInsider·SEC 사이트를 따로 열지 않아도, 내부자 거래와 미국 정치인 주식 매매 데이터를 앱에서 바로 확인합니다",
      },
      {
        icon: "⭐",
        title: "관심종목 등록 & 통합 팔로우",
        benefit:
          "관심 종목을 등록하면 관련 뉴스·루머·리포트·ETF 편입 여부·내부자 거래 데이터를 자동으로 모아 보여줍니다",
      },
    ],
  },
  pricing: {
    headline: "지금은 무료로 다운로드하고, 직접 확인해보세요",
    description:
      "[앱명]은 플레이스토어에서 무료로 다운로드할 수 있습니다.\n기본 기능은 무료로 제공되며, 더 깊은 분석 기능은 앱 안에서 확인할 수 있습니다.",
    freeItems: [
      "미국주식 뉴스 번역 (매일 업데이트)",
      "오늘의 미국장 이슈 레이더",
      "루머 vs 확인된 사실 구분",
      "관심종목 등록",
    ],
    premiumItems: [
      "ETF 네비게이터 상세 분석",
      "애널리스트 리포트 전체",
      "내부자 거래 데이터 전체",
      "상하원 의원 매매 전체",
    ],
    cta: "플레이스토어에서 무료로 다운로드",
    micro: "신용카드 불필요 · 구독 없음 · 플레이스토어 무료 앱",
  },
  faq: {
    headline: "자주 묻는 질문",
    items: [
      {
        q: "야후파이낸스나 인베스팅닷컴 대신 왜 이 앱을 써야 하나요?",
        a: "야후파이낸스·인베스팅닷컴은 영어 중심이며, 뉴스·ETF·내부자 거래를 각각 다른 사이트에서 봐야 합니다. [앱명]은 한국 투자자 눈높이에 맞춰 이 모든 정보를 한국어로, 한 앱에서 제공합니다.",
      },
      {
        q: "무료로 어디까지 사용할 수 있나요?",
        a: "뉴스 번역, 오늘의 미국장 이슈 레이더, 루머 vs 사실 구분, 관심종목 등록은 무료입니다. ETF 상세 분석·애널리스트 리포트 전체·내부자 거래 전체 데이터는 앱 내에서 확인하실 수 있습니다.",
      },
      {
        q: "지금 보유한 관심 종목과 어떻게 연결되나요?",
        a: "앱에서 관심종목을 직접 등록하면, 해당 종목의 뉴스·루머·리포트·ETF 편입 여부·내부자 거래 데이터를 자동으로 모아 보여줍니다. 기존 보유 종목 그대로 등록하면 됩니다.",
      },
      {
        q: "이 앱이 특정 주식을 추천해주는 건가요?",
        a: "[앱명]은 추천주 앱이 아니라 정보 제공 앱입니다. 매수·매도 추천이나 수익 보장은 없습니다. 투자 판단에 필요한 정보를 빠르고 정확하게 전달하는 것이 목적입니다.",
      },
      {
        q: "앱 데이터는 얼마나 자주 업데이트되나요?",
        a: "미국주식 뉴스와 오늘의 이슈 레이더는 매일 업데이트됩니다. 내부자 거래·ETF 데이터는 미국 공식 소스 기준으로 정기적으로 갱신됩니다.",
      },
      {
        q: "안드로이드만 지원하나요? iOS는 없나요?",
        a: "현재는 플레이스토어(안드로이드) 버전으로 출시됩니다. iOS 버전은 순차적으로 출시 예정입니다.",
      },
      {
        q: "루머 정보가 너무 자극적이거나 부정확하지 않을까요?",
        a: "루머와 확인된 사실을 명확히 구분해서 제공합니다. '확인된 사실'과 '시장 관측'을 별도 표기하여, 루머를 맹목적으로 따르지 않도록 설계되어 있습니다.",
      },
    ],
  },
  finalCta: {
    headline: "오늘 미국장 열리기 전에, 확인해야 할 정보가 있습니다",
    checks: [
      "뉴스·루머·리포트·ETF·내부자 거래, 앱 하나에서 한국어로 확인",
      "매일 7개 사이트를 오가던 시간, 이제 5분으로 줄이세요",
      "추천주 없음. 내 판단을 위한 정보만 제공합니다",
    ],
    cta: "지금 바로 플레이스토어에서 다운로드",
    urgency: "오늘의 미국장 이슈 레이더는 매일 업데이트됩니다. 지금 바로 확인하세요.",
    trust: "무료 다운로드 · 신용카드 불필요 · 특정 종목 추천 없음",
  },
} as const;
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
npm test -- constants
```

Expected: PASS (5 tests)

- [ ] **Step 5: 커밋**

```bash
git add lib/constants.ts __tests__/constants.test.ts __mocks__/
git commit -m "feat: add constants file with all landing page copy"
```

---

## Task 3: 공통 UI 컴포넌트

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/SectionHeader.tsx`
- Create: `__tests__/ui/Button.test.tsx`
- Create: `__tests__/ui/SectionHeader.test.tsx`

- [ ] **Step 1: Button 실패 테스트 작성**

`__tests__/ui/Button.test.tsx`:

```typescript
import { render, screen } from "@testing-library/react";
import Button from "@/components/ui/Button";

describe("Button", () => {
  it("children 텍스트를 렌더한다", () => {
    render(<Button href="https://example.com">다운로드</Button>);
    expect(screen.getByText("다운로드")).toBeInTheDocument();
  });

  it("href 링크가 올바르게 설정된다", () => {
    render(<Button href="https://example.com">다운로드</Button>);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://example.com"
    );
  });

  it("target=_blank와 rel이 설정된다", () => {
    render(<Button href="https://example.com">다운로드</Button>);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
npm test -- Button
```

Expected: FAIL — Cannot find module

- [ ] **Step 3: Button 구현**

`components/ui/Button.tsx`:

```typescript
import { ReactNode } from "react";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 px-8 py-4 text-base sm:text-lg";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:scale-95",
    secondary:
      "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 active:scale-95",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
```

- [ ] **Step 4: SectionHeader 실패 테스트 작성**

`__tests__/ui/SectionHeader.test.tsx`:

```typescript
import { render, screen } from "@testing-library/react";
import SectionHeader from "@/components/ui/SectionHeader";

describe("SectionHeader", () => {
  it("headline을 렌더한다", () => {
    render(<SectionHeader headline="테스트 헤드라인" />);
    expect(screen.getByText("테스트 헤드라인")).toBeInTheDocument();
  });

  it("sub가 있으면 렌더한다", () => {
    render(<SectionHeader headline="헤드라인" sub="서브텍스트" />);
    expect(screen.getByText("서브텍스트")).toBeInTheDocument();
  });

  it("sub가 없으면 렌더하지 않는다", () => {
    render(<SectionHeader headline="헤드라인" />);
    expect(screen.queryByTestId("section-sub")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 5: SectionHeader 구현**

`components/ui/SectionHeader.tsx`:

```typescript
interface SectionHeaderProps {
  headline: string;
  sub?: string;
  align?: "left" | "center";
}

export default function SectionHeader({
  headline,
  sub,
  align = "center",
}: SectionHeaderProps) {
  const alignment = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`mb-12 ${alignment}`}>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
        {headline}
      </h2>
      {sub && (
        <p
          data-testid="section-sub"
          className="mt-4 text-base sm:text-lg text-gray-600"
        >
          {sub}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 6: 테스트 통과 확인**

```bash
npm test -- Button SectionHeader
```

Expected: PASS (6 tests)

- [ ] **Step 7: 커밋**

```bash
git add components/ui/ __tests__/ui/
git commit -m "feat: add Button and SectionHeader UI components"
```

---

## Task 4: Hero 섹션

**Files:**
- Create: `components/sections/Hero.tsx`
- Create: `__tests__/sections/Hero.test.tsx`

- [ ] **Step 1: 실패 테스트 작성**

`__tests__/sections/Hero.test.tsx`:

```typescript
import { render, screen } from "@testing-library/react";
import Hero from "@/components/sections/Hero";

describe("Hero", () => {
  it("H1 헤드라인을 렌더한다", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", { level: 1 })
    ).toHaveTextContent("미국주식 정보, 한곳에서");
  });

  it("플레이스토어 다운로드 링크가 있다", () => {
    render(<Hero />);
    const links = screen.getAllByRole("link");
    expect(links.some((l) => l.getAttribute("href")?.includes("play.google.com"))).toBe(true);
  });

  it("마이크로카피가 렌더된다", () => {
    render(<Hero />);
    expect(screen.getByText(/특정 종목 추천 없음/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
npm test -- Hero
```

Expected: FAIL — Cannot find module

- [ ] **Step 3: Hero 컴포넌트 구현**

`components/sections/Hero.tsx`:

```typescript
import Button from "@/components/ui/Button";
import { COPY, PLAYSTORE_URL } from "@/lib/constants";

export default function Hero() {
  const { h1, sub, cta, micro } = COPY.hero;

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* 좌측: 텍스트 */}
          <div className="flex-1 text-center lg:text-left">
            {/* 포지셔닝 뱃지 */}
            <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full mb-6">
              정보 제공 앱 · 추천주 없음
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
              {h1}
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 whitespace-pre-line leading-relaxed">
              {sub}
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">
              <Button href={PLAYSTORE_URL} className="w-full sm:w-auto text-lg px-10 py-5">
                {cta}
              </Button>
            </div>

            {/* 마이크로카피 */}
            <p className="mt-4 text-sm text-gray-500">{micro}</p>
          </div>

          {/* 우측: 앱 화면 목업 자리 */}
          <div className="flex-1 w-full max-w-md lg:max-w-lg">
            <div className="bg-gray-100 rounded-3xl aspect-[9/16] max-h-96 lg:max-h-[520px] flex items-center justify-center border-2 border-dashed border-gray-300">
              <p className="text-gray-400 text-sm font-medium text-center px-4">
                앱 화면 스크린샷<br />
                <span className="text-xs">(실제 화면으로 교체)</span>
              </p>
            </div>
          </div>
        </div>

        {/* 보조 신뢰 바 */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500 mb-6">앱 실제 화면 미리보기</p>
          <div className="flex gap-3 overflow-x-auto pb-2 justify-center">
            {["뉴스", "루머 구분", "ETF", "리포트", "내부자 거래"].map((label) => (
              <div
                key={label}
                className="flex-shrink-0 bg-gray-100 rounded-xl w-28 h-20 sm:w-36 sm:h-24 flex items-center justify-center border border-gray-200"
              >
                <span className="text-xs text-gray-400 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
npm test -- Hero
```

Expected: PASS (3 tests)

- [ ] **Step 5: 커밋**

```bash
git add components/sections/Hero.tsx __tests__/sections/Hero.test.tsx
git commit -m "feat: add Hero section"
```

---

## Task 5: ProblemAgitation 섹션

**Files:**
- Create: `components/sections/ProblemAgitation.tsx`
- Create: `__tests__/sections/ProblemAgitation.test.tsx`

- [ ] **Step 1: 실패 테스트 작성**

`__tests__/sections/ProblemAgitation.test.tsx`:

```typescript
import { render, screen } from "@testing-library/react";
import ProblemAgitation from "@/components/sections/ProblemAgitation";
import { COPY } from "@/lib/constants";

describe("ProblemAgitation", () => {
  it("소제목을 렌더한다", () => {
    render(<ProblemAgitation />);
    expect(screen.getByText(COPY.problem.title)).toBeInTheDocument();
  });

  it("Pain Point 4개를 모두 렌더한다", () => {
    render(<ProblemAgitation />);
    COPY.problem.items.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it("브릿지 문장을 렌더한다", () => {
    render(<ProblemAgitation />);
    expect(screen.getByText(/이제 다른 방법이 있습니다/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
npm test -- ProblemAgitation
```

Expected: FAIL

- [ ] **Step 3: ProblemAgitation 구현**

`components/sections/ProblemAgitation.tsx`:

```typescript
import { COPY } from "@/lib/constants";

const ICONS = ["⏰", "🔀", "❓", "🌐"];

export default function ProblemAgitation() {
  const { title, items, alternativesMention, bridge } = COPY.problem;

  return (
    <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">
          {title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <span className="text-2xl flex-shrink-0">{ICONS[i]}</span>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                {item}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-10 text-center">
          <p className="text-amber-800 text-sm sm:text-base font-medium">
            {alternativesMention}
          </p>
        </div>

        <div className="text-center bg-blue-600 rounded-2xl p-8">
          <p className="text-white text-lg sm:text-xl font-bold whitespace-pre-line leading-relaxed">
            {bridge}
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
npm test -- ProblemAgitation
```

Expected: PASS (3 tests)

- [ ] **Step 5: 커밋**

```bash
git add components/sections/ProblemAgitation.tsx __tests__/sections/ProblemAgitation.test.tsx
git commit -m "feat: add ProblemAgitation section"
```

---

## Task 6: Solution 섹션

**Files:**
- Create: `components/sections/Solution.tsx`
- Create: `__tests__/sections/Solution.test.tsx`

- [ ] **Step 1: 실패 테스트 작성**

`__tests__/sections/Solution.test.tsx`:

```typescript
import { render, screen } from "@testing-library/react";
import Solution from "@/components/sections/Solution";
import { COPY } from "@/lib/constants";

describe("Solution", () => {
  it("솔루션 헤드라인을 렌더한다", () => {
    render(<Solution />);
    expect(screen.getByText(/흩어진 미국주식 정보를/)).toBeInTheDocument();
  });

  it("Before 텍스트가 렌더된다", () => {
    render(<Solution />);
    expect(screen.getByText(COPY.solution.before)).toBeInTheDocument();
  });

  it("After 텍스트가 렌더된다", () => {
    render(<Solution />);
    expect(screen.getByText(COPY.solution.after)).toBeInTheDocument();
  });

  it("3단계 스텝이 모두 렌더된다", () => {
    render(<Solution />);
    COPY.solution.steps.forEach((step) => {
      expect(screen.getByText(step)).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
npm test -- Solution
```

Expected: FAIL

- [ ] **Step 3: Solution 구현**

`components/sections/Solution.tsx`:

```typescript
import SectionHeader from "@/components/ui/SectionHeader";
import { COPY } from "@/lib/constants";

export default function Solution() {
  const { headline, before, after, steps, diff } = COPY.solution;

  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionHeader headline={headline} />

        {/* Before / After */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3">
              Before
            </p>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {before}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-3">
              After
            </p>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {after}
            </p>
          </div>
        </div>

        {/* 3단계 흐름 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-3">
                  {i + 1}
                </div>
                <p className="text-gray-800 text-sm sm:text-base font-medium max-w-[120px]">
                  {step}
                </p>
              </div>
              {i < steps.length - 1 && (
                <span className="text-gray-300 text-2xl hidden sm:block">→</span>
              )}
            </div>
          ))}
        </div>

        {/* 차별점 */}
        <div className="bg-blue-50 rounded-2xl p-6 text-center">
          <p className="text-blue-800 text-sm sm:text-base leading-relaxed">
            {diff}
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
npm test -- Solution
```

Expected: PASS (4 tests)

- [ ] **Step 5: 커밋**

```bash
git add components/sections/Solution.tsx __tests__/sections/Solution.test.tsx
git commit -m "feat: add Solution section"
```

---

## Task 7: SocialProof 섹션

**Files:**
- Create: `components/sections/SocialProof.tsx`
- Create: `__tests__/sections/SocialProof.test.tsx`

- [ ] **Step 1: 실패 테스트 작성**

`__tests__/sections/SocialProof.test.tsx`:

```typescript
import { render, screen } from "@testing-library/react";
import SocialProof from "@/components/sections/SocialProof";
import { COPY } from "@/lib/constants";

describe("SocialProof", () => {
  it("섹션 헤드라인을 렌더한다", () => {
    render(<SocialProof />);
    expect(screen.getByText(COPY.socialProof.headline)).toBeInTheDocument();
  });

  it("데이터 출처 투명성 문구가 렌더된다", () => {
    render(<SocialProof />);
    expect(screen.getByText(COPY.socialProof.dataSource)).toBeInTheDocument();
  });

  it("투자 유의 고지 문구가 렌더된다", () => {
    render(<SocialProof />);
    expect(screen.getByText(COPY.socialProof.disclaimer)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
npm test -- SocialProof
```

Expected: FAIL

- [ ] **Step 3: SocialProof 구현**

`components/sections/SocialProof.tsx`:

```typescript
import SectionHeader from "@/components/ui/SectionHeader";
import { COPY } from "@/lib/constants";

const TRUST_CARDS = [
  {
    icon: "📱",
    title: "실제 앱 화면",
    body: "뉴스 · 루머 구분 · ETF 네비게이터 · 내부자 거래 · AI 포트폴리오 화면을 직접 확인하세요.",
  },
  {
    icon: "🏛️",
    title: "공식 데이터 출처",
    body: COPY.socialProof.dataSource,
  },
  {
    icon: "⏱️",
    title: "사용 전후 비교",
    body: `Before: ${COPY.socialProof.before}\nAfter: ${COPY.socialProof.after}`,
  },
];

export default function SocialProof() {
  const { headline, disclaimer } = COPY.socialProof;

  return (
    <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionHeader headline={headline} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {TRUST_CARDS.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <span className="text-3xl mb-4 block">{card.icon}</span>
              <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {card.body}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 text-center">
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
npm test -- SocialProof
```

Expected: PASS (3 tests)

- [ ] **Step 5: 커밋**

```bash
git add components/sections/SocialProof.tsx __tests__/sections/SocialProof.test.tsx
git commit -m "feat: add SocialProof section (alternative trust assets)"
```

---

## Task 8: Features 섹션

**Files:**
- Create: `components/sections/Features.tsx`
- Create: `__tests__/sections/Features.test.tsx`

- [ ] **Step 1: 실패 테스트 작성**

`__tests__/sections/Features.test.tsx`:

```typescript
import { render, screen } from "@testing-library/react";
import Features from "@/components/sections/Features";
import { COPY } from "@/lib/constants";

describe("Features", () => {
  it("섹션 헤드라인을 렌더한다", () => {
    render(<Features />);
    expect(screen.getByText(/당신이 얻게 될 것들/)).toBeInTheDocument();
  });

  it("기능 카드 6개를 모두 렌더한다", () => {
    render(<Features />);
    COPY.features.items.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });

  it("각 기능의 혜택 설명이 렌더된다", () => {
    render(<Features />);
    COPY.features.items.forEach((item) => {
      expect(screen.getByText(item.benefit)).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
npm test -- Features
```

Expected: FAIL

- [ ] **Step 3: Features 구현**

`components/sections/Features.tsx`:

```typescript
import SectionHeader from "@/components/ui/SectionHeader";
import { COPY } from "@/lib/constants";

export default function Features() {
  const { headline, items } = COPY.features;

  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeader headline={headline} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200 bg-white"
            >
              <span className="text-4xl mb-4 block">{item.icon}</span>
              <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.benefit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
npm test -- Features
```

Expected: PASS (3 tests)

- [ ] **Step 5: 커밋**

```bash
git add components/sections/Features.tsx __tests__/sections/Features.test.tsx
git commit -m "feat: add Features section with 6 benefit cards"
```

---

## Task 9: Pricing 섹션

**Files:**
- Create: `components/sections/Pricing.tsx`
- Create: `__tests__/sections/Pricing.test.tsx`

- [ ] **Step 1: 실패 테스트 작성**

`__tests__/sections/Pricing.test.tsx`:

```typescript
import { render, screen } from "@testing-library/react";
import Pricing from "@/components/sections/Pricing";
import { COPY } from "@/lib/constants";

describe("Pricing", () => {
  it("가격 헤드라인을 렌더한다", () => {
    render(<Pricing />);
    expect(screen.getByText(COPY.pricing.headline)).toBeInTheDocument();
  });

  it("무료 기능 항목이 모두 렌더된다", () => {
    render(<Pricing />);
    COPY.pricing.freeItems.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it("마이크로카피가 렌더된다", () => {
    render(<Pricing />);
    expect(screen.getByText(COPY.pricing.micro)).toBeInTheDocument();
  });

  it("CTA 링크가 플레이스토어로 연결된다", () => {
    render(<Pricing />);
    const links = screen.getAllByRole("link");
    expect(
      links.some((l) => l.getAttribute("href")?.includes("play.google.com"))
    ).toBe(true);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
npm test -- Pricing
```

Expected: FAIL

- [ ] **Step 3: Pricing 구현**

`components/sections/Pricing.tsx`:

```typescript
import Button from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import { COPY, PLAYSTORE_URL } from "@/lib/constants";

export default function Pricing() {
  const { headline, description, freeItems, premiumItems, cta, micro } =
    COPY.pricing;

  return (
    <section className="bg-blue-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <SectionHeader headline={headline} />

        <p className="text-center text-gray-600 mb-10 whitespace-pre-line">
          {description}
        </p>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {/* 무료 */}
            <div className="p-8">
              <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-4">
                무료 제공
              </p>
              <ul className="space-y-3">
                {freeItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 font-bold flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* 앱 내 확인 가능 */}
            <div className="p-8 bg-gray-50">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">
                앱 내 확인 가능
              </p>
              <ul className="space-y-3">
                {premiumItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-500 font-bold flex-shrink-0">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button href={PLAYSTORE_URL} className="mb-4">{cta}</Button>
          <p className="text-sm text-gray-500">{micro}</p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
npm test -- Pricing
```

Expected: PASS (4 tests)

- [ ] **Step 5: 커밋**

```bash
git add components/sections/Pricing.tsx __tests__/sections/Pricing.test.tsx
git commit -m "feat: add Pricing section with free/premium breakdown"
```

---

## Task 10: FAQ 섹션

**Files:**
- Create: `components/sections/FAQ.tsx`
- Create: `__tests__/sections/FAQ.test.tsx`

- [ ] **Step 1: 실패 테스트 작성**

`__tests__/sections/FAQ.test.tsx`:

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import FAQ from "@/components/sections/FAQ";
import { COPY } from "@/lib/constants";

describe("FAQ", () => {
  it("FAQ 헤드라인을 렌더한다", () => {
    render(<FAQ />);
    expect(screen.getByText(COPY.faq.headline)).toBeInTheDocument();
  });

  it("첫 번째 질문 텍스트가 보인다", () => {
    render(<FAQ />);
    expect(screen.getByText(COPY.faq.items[0].q)).toBeInTheDocument();
  });

  it("질문 클릭 시 답변이 펼쳐진다", () => {
    render(<FAQ />);
    const firstQ = screen.getByText(COPY.faq.items[0].q);
    fireEvent.click(firstQ);
    expect(screen.getByText(COPY.faq.items[0].a)).toBeVisible();
  });

  it("7개의 질문이 모두 렌더된다", () => {
    render(<FAQ />);
    expect(screen.getAllByRole("button")).toHaveLength(7);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
npm test -- FAQ
```

Expected: FAIL

- [ ] **Step 3: FAQ 구현**

`components/sections/FAQ.tsx`:

```typescript
"use client";

import { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { COPY } from "@/lib/constants";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { headline, items } = COPY.faq;

  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <SectionHeader headline={headline} />

        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-2xl overflow-hidden"
            >
              <button
                className="w-full text-left flex items-center justify-between p-5 sm:p-6 hover:bg-gray-50 transition-colors duration-150"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                <span className="font-semibold text-gray-900 text-sm sm:text-base pr-4">
                  {item.q}
                </span>
                <span className="flex-shrink-0 text-blue-600 text-xl">
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              {openIndex === i && (
                <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
npm test -- FAQ
```

Expected: PASS (4 tests)

- [ ] **Step 5: 커밋**

```bash
git add components/sections/FAQ.tsx __tests__/sections/FAQ.test.tsx
git commit -m "feat: add FAQ section with accordion interaction"
```

---

## Task 11: FinalCTA 섹션

**Files:**
- Create: `components/sections/FinalCTA.tsx`
- Create: `__tests__/sections/FinalCTA.test.tsx`

- [ ] **Step 1: 실패 테스트 작성**

`__tests__/sections/FinalCTA.test.tsx`:

```typescript
import { render, screen } from "@testing-library/react";
import FinalCTA from "@/components/sections/FinalCTA";
import { COPY } from "@/lib/constants";

describe("FinalCTA", () => {
  it("강화된 헤드라인을 렌더한다", () => {
    render(<FinalCTA />);
    expect(screen.getByText(COPY.finalCta.headline)).toBeInTheDocument();
  });

  it("핵심 가치 제안 3줄이 모두 렌더된다", () => {
    render(<FinalCTA />);
    COPY.finalCta.checks.forEach((check) => {
      expect(screen.getByText(check)).toBeInTheDocument();
    });
  });

  it("CTA 링크가 플레이스토어로 연결된다", () => {
    render(<FinalCTA />);
    const links = screen.getAllByRole("link");
    expect(
      links.some((l) => l.getAttribute("href")?.includes("play.google.com"))
    ).toBe(true);
  });

  it("긴급성 마이크로카피가 렌더된다", () => {
    render(<FinalCTA />);
    expect(screen.getByText(COPY.finalCta.urgency)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
npm test -- FinalCTA
```

Expected: FAIL

- [ ] **Step 3: FinalCTA 구현**

`components/sections/FinalCTA.tsx`:

```typescript
import Button from "@/components/ui/Button";
import { COPY, PLAYSTORE_URL } from "@/lib/constants";

export default function FinalCTA() {
  const { headline, checks, cta, urgency, trust } = COPY.finalCta;

  return (
    <section className="bg-gray-900 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-10 leading-tight">
          {headline}
        </h2>

        <ul className="space-y-4 mb-12 text-left inline-block">
          {checks.map((check, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-blue-400 font-bold text-lg flex-shrink-0">✓</span>
              <span className={`text-base sm:text-lg ${i === 1 ? "text-yellow-300 font-semibold" : "text-gray-200"}`}>
                {check}
              </span>
            </li>
          ))}
        </ul>

        <div className="mb-6">
          <Button
            href={PLAYSTORE_URL}
            className="text-lg px-10 py-5 shadow-2xl shadow-blue-500/30"
          >
            {cta}
          </Button>
        </div>

        <p className="text-blue-300 text-sm mb-6">{urgency}</p>

        <p className="text-gray-500 text-xs">{trust}</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
npm test -- FinalCTA
```

Expected: PASS (4 tests)

- [ ] **Step 5: 커밋**

```bash
git add components/sections/FinalCTA.tsx __tests__/sections/FinalCTA.test.tsx
git commit -m "feat: add FinalCTA section"
```

---

## Task 12: 레이아웃 + 글로벌 스타일

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: globals.css 수정**

`app/globals.css` 내용 전체를 아래로 교체한다:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@font-face {
  font-family: "Pretendard";
  src: url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css");
}

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
      sans-serif;
    -webkit-font-smoothing: antialiased;
  }
}
```

- [ ] **Step 2: layout.tsx 수정**

`app/layout.tsx`를 아래로 교체한다:

```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "미국주식 정보, 한곳에서 | [앱명]",
  description:
    "뉴스·루머·리포트·ETF 분석·내부자 거래까지, 한국 투자자를 위한 미국주식 정보 대시보드. 플레이스토어에서 무료 다운로드.",
  keywords: [
    "미국주식",
    "미국주식 뉴스",
    "ETF 분석",
    "내부자 거래",
    "주식 앱",
    "미국주식 앱",
    "한국 투자자",
  ],
  openGraph: {
    title: "미국주식 정보, 한곳에서 | [앱명]",
    description:
      "뉴스·루머·리포트·ETF·내부자 거래를 한국어로, 한 앱에서 확인하세요.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: 커밋**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: configure layout with Pretendard font and SEO metadata"
```

---

## Task 13: 페이지 조합 (app/page.tsx)

**Files:**
- Modify: `app/page.tsx`
- Create: `__tests__/page.test.tsx`

- [ ] **Step 1: 실패 테스트 작성**

`__tests__/page.test.tsx`:

```typescript
import { render, screen } from "@testing-library/react";
import Page from "@/app/page";

describe("Page", () => {
  it("Hero H1이 렌더된다", () => {
    render(<Page />);
    expect(
      screen.getByRole("heading", { level: 1 })
    ).toHaveTextContent("미국주식 정보, 한곳에서");
  });

  it("페이지에 플레이스토어 링크가 최소 3개 이상 존재한다", () => {
    render(<Page />);
    const links = screen.getAllByRole("link");
    const playstoreLinks = links.filter((l) =>
      l.getAttribute("href")?.includes("play.google.com")
    );
    expect(playstoreLinks.length).toBeGreaterThanOrEqual(3);
  });

  it("FAQ 섹션이 렌더된다", () => {
    render(<Page />);
    expect(screen.getByText("자주 묻는 질문")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
npm test -- page
```

Expected: FAIL

- [ ] **Step 3: page.tsx 구현**

`app/page.tsx`:

```typescript
import Hero from "@/components/sections/Hero";
import ProblemAgitation from "@/components/sections/ProblemAgitation";
import Solution from "@/components/sections/Solution";
import SocialProof from "@/components/sections/SocialProof";
import Features from "@/components/sections/Features";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Page() {
  return (
    <main>
      <Hero />
      <ProblemAgitation />
      <Solution />
      <SocialProof />
      <Features />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
npm test -- page
```

Expected: PASS (3 tests)

- [ ] **Step 5: 전체 테스트 통과 확인**

```bash
npm test
```

Expected: 모든 테스트 PASS (약 30개)

- [ ] **Step 6: 커밋**

```bash
git add app/page.tsx __tests__/page.test.tsx
git commit -m "feat: assemble all 8 sections into page"
```

---

## Task 14: E2E 테스트 (CTA 검증)

**Files:**
- Create: `e2e/landing.spec.ts`

- [ ] **Step 1: E2E 테스트 작성**

`e2e/landing.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";

test.describe("랜딩페이지 CTA 검증", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Hero H1이 보인다", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "미국주식 정보, 한곳에서" })
    ).toBeVisible();
  });

  test("Hero CTA 버튼이 플레이스토어 URL을 가진다", async ({ page }) => {
    const ctaLinks = page.getByRole("link", {
      name: /플레이스토어에서 무료 다운로드/i,
    });
    await expect(ctaLinks.first()).toHaveAttribute(
      "href",
      /play\.google\.com/
    );
  });

  test("모바일 뷰포트에서 H1과 CTA가 첫 화면에 보인다", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(
      page.getByRole("heading", { name: "미국주식 정보, 한곳에서" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /무료 다운로드/i }).first()
    ).toBeVisible();
  });

  test("FAQ 첫 번째 항목 클릭 시 답변이 펼쳐진다", async ({ page }) => {
    const firstFaqButton = page.getByRole("button").first();
    await firstFaqButton.click();
    await expect(
      page.getByText(/야후파이낸스·인베스팅닷컴은 영어 중심/)
    ).toBeVisible();
  });

  test("Final CTA 섹션의 CTA 버튼이 보인다", async ({ page }) => {
    await page.getByRole("link", {
      name: /지금 바로 플레이스토어에서 다운로드/i,
    }).scrollIntoViewIfNeeded();
    await expect(
      page.getByRole("link", {
        name: /지금 바로 플레이스토어에서 다운로드/i,
      })
    ).toBeVisible();
  });
});
```

- [ ] **Step 2: 개발 서버 기동 후 E2E 실행**

터미널 1에서:
```bash
npm run dev
```

터미널 2에서:
```bash
npm run test:e2e
```

Expected: 5 tests PASS

- [ ] **Step 3: 커밋**

```bash
git add e2e/landing.spec.ts
git commit -m "test: add Playwright E2E tests for CTA and key interactions"
```

---

## Task 15: 빌드 검증 및 최종 정리

**Files:**
- 수정 없음 (검증만)

- [ ] **Step 1: 프로덕션 빌드 확인**

```bash
npm run build
```

Expected: `out/` 디렉토리 생성, 에러 없음

- [ ] **Step 2: 빌드 결과물 로컬 미리보기**

```bash
npx serve out
```

Expected: `http://localhost:3000` (또는 자동 할당 포트)에서 정적 빌드 확인

- [ ] **Step 3: 최종 전체 테스트**

```bash
npm test
```

Expected: 모든 단위 테스트 PASS

- [ ] **Step 4: 앱명·스토어 URL 교체 안내 확인**

`lib/constants.ts`의 아래 두 값을 실제 값으로 교체:
```typescript
export const APP_NAME = "[앱명]";  // ← 실제 앱명으로 교체
export const PLAYSTORE_URL = "https://play.google.com/store/apps/details?id=YOUR_APP_ID";  // ← 실제 패키지 ID로 교체
```

교체 후 재빌드:
```bash
npm run build
```

- [ ] **Step 5: 최종 커밋**

```bash
git add .
git commit -m "chore: verify production build passes"
```

---

## 앱명 및 스토어 URL 교체 체크리스트

플레이스토어 등록 후 아래 두 값만 교체하면 전체 카피가 자동 반영됩니다:

| 파일 | 변수 | 교체 내용 |
|------|------|-----------|
| `lib/constants.ts` | `APP_NAME` | 확정된 앱 이름 |
| `lib/constants.ts` | `PLAYSTORE_URL` | `?id=` 이후 실제 패키지명 |

---

## 섹션별 앱 화면 교체 위치

| 섹션 | 파일 | 교체 내용 |
|------|------|-----------|
| Hero 우측 목업 | `components/sections/Hero.tsx` | `<div className="bg-gray-100...">` 블록을 실제 `<Image>` 컴포넌트로 교체 |
| Hero 신뢰 바 썸네일 | `components/sections/Hero.tsx` | 각 `<div>` 블록을 실제 스크린샷 이미지로 교체 |
| SocialProof 카드 | `components/sections/SocialProof.tsx` | TRUST_CARDS 첫 번째 카드에 실제 앱 화면 이미지 추가 |
