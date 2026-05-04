# Landing Page Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기획문서(랜딩페이지기획.txt) 기준 8개 섹션(HERO · PROBLEM · SOLUTION · SOCIAL PROOF · FEATURES · OFFER · FAQ · FINAL CTA)으로 랜딩페이지를 전면 재작성한다.

**Architecture:** `src/pages/index.astro`를 전면 교체. `src/components/islands/FaqAccordion.tsx`를 7개 Q&A로 업데이트. 신규 컴포넌트 추가 없이 기존 island(`TrackedCtaButton`, `FaqAccordion`)과 인라인 Tailwind만 사용. 앱명 `[앱명]` → `스톡핑`으로 전체 교체.

**Tech Stack:** Astro v6 (prerender=true), Tailwind CSS, React islands (`TrackedCtaButton`, `FaqAccordion`), `links.playStore`, `siteConfig`

---

## File Structure

| 파일 | 변경 |
|---|---|
| `src/pages/index.astro` | 전면 교체 — 8개 섹션 |
| `src/components/islands/FaqAccordion.tsx` | 7개 Q&A로 업데이트 |

---

### Task 1: FaqAccordion 7개 Q&A 업데이트

**Files:**
- Modify: `src/components/islands/FaqAccordion.tsx`

- [ ] **Step 1: `src/components/islands/FaqAccordion.tsx` 전체 교체**

  현재 5개 Q&A → 7개로 교체한다. 파일 전체를 아래로 대체:

  ```tsx
  import { useState } from "react";

  const faqs = [
    {
      q: "이 앱은 특정 종목을 추천하나요?",
      a: "아닙니다. 스톡핑은 미국주식 관련 뉴스·루머·리포트·ETF 분석·내부자 거래 데이터를 한곳에 정리해 드리는 정보 제공 앱입니다. 매수·매도 추천이나 수익 보장과는 전혀 다릅니다.",
    },
    {
      q: "앱은 무료로 사용할 수 있나요?",
      a: "기본 기능은 무료로 이용할 수 있습니다. 애널리스트 리포트 상세 보기, 내부자 거래 전체 데이터 등 일부 심화 기능은 앱 내 결제로 이용할 수 있습니다. 먼저 무료로 다운로드해 확인해 보세요.",
    },
    {
      q: "어떤 정보를 확인할 수 있나요?",
      a: "미국주식 뉴스 번역, 오늘의 이슈 레이더(확인된 사실·시장 관측·루머 분류), 애널리스트 리포트·목표가, ETF 보유 종목·배당·수수료 분석, 내부자 거래, 미국 상하원 의원 매매 데이터 등을 한곳에서 확인할 수 있습니다.",
    },
    {
      q: "이슈 레이더는 매일 업데이트되나요?",
      a: "네, 미국 주식 시장 흐름에 맞춰 매일 3~5개의 핵심 이슈를 정리해 업데이트합니다. 확인된 사실·시장 관측·루머를 구분해 제공하므로 SNS에서 보이는 정보를 그대로 믿는 일을 줄일 수 있습니다.",
    },
    {
      q: "'확인된 사실'과 '시장 관측'은 어떻게 다른가요?",
      a: "'확인된 사실'은 공식 발표·공시·실적 데이터 등 검증된 정보입니다. '시장 관측'은 이를 기반으로 한 시장의 해석과 전망입니다. '루머'는 아직 공식 확인이 안 된 정보입니다. 세 가지를 나눠 볼 수 있어 정보의 신뢰도를 스스로 판단하기 쉽습니다.",
    },
    {
      q: "앱은 어디서 다운로드하나요?",
      a: "현재 구글 플레이 스토어에서 다운로드할 수 있습니다. 검색창에 '스톡핑'을 검색하거나 이 페이지의 다운로드 버튼을 눌러 바로 이동할 수 있습니다.",
    },
    {
      q: "iOS 버전은 언제 나오나요?",
      a: "iOS(애플 앱스토어) 버전을 준비 중입니다. 현재는 안드로이드(구글 플레이) 버전만 이용 가능합니다. iOS 출시 시 별도 안내드리겠습니다.",
    },
  ];

  export function FaqAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white"
          >
            <button
              className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-slate-50"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span className="pr-4 font-semibold text-slate-900">{faq.q}</span>
              <svg
                className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openIndex === i && (
              <div className="border-t border-slate-100 px-6 pb-5 pt-4 text-sm leading-7 text-slate-600">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/components/islands/FaqAccordion.tsx
  git commit -m "feat: update FaqAccordion with 7 Q&As per landing page spec"
  ```

---

### Task 2: `index.astro` 전면 교체 — 8개 섹션

**Files:**
- Modify: `src/pages/index.astro`

현재 파일은 6개 섹션(HERO · SOCIAL PROOF · BENEFITS · HOW IT WORKS · FAQ · FINAL CTA)으로 구성되어 있다. 기획문서 기준 8개 섹션으로 전면 재작성한다.

**섹션 구성:**
1. **HERO** — 메인 카피 + 2열 레이아웃 + Primary CTA
2. **PROBLEM AGITATION** — 4개 Pain Point + 브릿지 문장
3. **SOLUTION** — Before/After 표 + 3단계 워크플로
4. **SOCIAL PROOF** — 4개 신뢰 지표
5. **FEATURES** — 6개 기능 카드
6. **OFFER/PRICING** — 무료 vs. 인앱 결제 표
7. **FAQ** — FaqAccordion (7개 Q&A)
8. **FINAL CTA** — 최종 다운로드 유도

- [ ] **Step 1: `src/pages/index.astro` 전체 교체**

  파일 전체를 아래 내용으로 대체한다:

  ```astro
  ---
  export const prerender = true;
  import BaseLayout from "../layouts/BaseLayout.astro";
  import { TrackedCtaButton } from "../components/islands/TrackedCtaButton";
  import { FaqAccordion } from "../components/islands/FaqAccordion";
  import { siteConfig } from "../config/site";
  import { links } from "../config/links";
  ---

  <BaseLayout title={siteConfig.defaultTitle} description={siteConfig.defaultDescription}>

    <!-- ════════════════════════════════════════════
         1. HERO — 메인 카피 + CTA
         목적: 5초 내 핵심 가치 전달 + 이탈 방지
    ════════════════════════════════════════════ -->
    <section class="bg-slate-900 px-4 pb-0 pt-14 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

          <!-- Left: Copy -->
          <div>
            <!-- Eyebrow -->
            <span class="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-4 py-1.5 text-xs font-semibold text-amber-400">
              <span class="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              한국 투자자를 위한 미국주식 정보 앱
            </span>

            <!-- H1 -->
            <h1 class="mt-6 text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[56px]">
              미국주식 정보,<br />
              <span class="text-amber-400">이제 한곳에서</span><br />
              확인하세요
            </h1>

            <!-- Sub-headline -->
            <p class="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              뉴스·루머·리포트·ETF 분석·내부자 거래까지.<br />
              여러 사이트를 오가지 않아도, 스톡핑 하나로 미국장 핵심 정보를 매일 확인합니다.
            </p>

            <!-- CTAs -->
            <div class="mt-8 flex flex-wrap gap-3">
              <TrackedCtaButton
                client:load
                href={links.playStore}
                label="플레이스토어에서 무료 다운로드"
                page="index"
                section="hero"
                variant="primary"
              />
              <a
                href="/radar"
                class="inline-flex items-center justify-center rounded-xl border border-slate-600 bg-slate-800 px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
              >
                오늘의 이슈 레이더 보기 →
              </a>
            </div>
            <!-- Trust micro-copy -->
            <p class="mt-3 text-xs text-slate-500">
              무료 다운로드 · 특정 종목 추천 없음 · 현재 Android(구글 플레이) 서비스 중
            </p>
          </div>

          <!-- Right: App preview strip (visual placeholder) -->
          <div class="mt-8 overflow-hidden rounded-t-2xl border border-b-0 border-slate-700 bg-slate-800 lg:mt-0">
            <div class="flex items-center justify-between border-b border-slate-700 px-5 py-3.5">
              <span class="text-sm font-semibold text-white">스톡핑 · 오늘의 미국장 이슈</span>
              <span class="rounded-full bg-amber-400/20 px-3 py-1 text-[11px] font-bold text-amber-400">Daily</span>
            </div>
            <!-- Issue card mock -->
            <div class="grid grid-cols-1 gap-3 p-4">
              <div class="rounded-xl border border-slate-700 bg-slate-900 p-4">
                <div class="mb-3 flex flex-wrap gap-2">
                  <span class="rounded-full bg-amber-400/15 px-2.5 py-1 text-[10px] font-bold text-amber-400">시장 관측</span>
                  <span class="rounded-full bg-blue-400/15 px-2.5 py-1 text-[10px] font-bold text-blue-400">NVDA · SMH</span>
                </div>
                <p class="text-xs font-semibold leading-snug text-white">반도체 대형주 실적 기대가 기술주 전체 심리에 미치는 영향</p>
                <div class="mt-2.5 space-y-1.5">
                  <div class="rounded-lg bg-slate-800 px-3 py-2">
                    <p class="mb-0.5 text-[10px] font-bold text-slate-500">확인된 사실</p>
                    <p class="text-[11px] leading-relaxed text-slate-300">주요 반도체 종목 실적 발표 일정·시장 관심 집중</p>
                  </div>
                  <div class="rounded-lg bg-slate-800 px-3 py-2">
                    <p class="mb-0.5 text-[10px] font-bold text-slate-500">시장 관측</p>
                    <p class="text-[11px] leading-relaxed text-slate-300">단기 수급 선반영으로 변동성 확대 가능</p>
                  </div>
                </div>
              </div>
              <div class="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4 opacity-50">
                <div class="mb-3 flex flex-wrap gap-2">
                  <span class="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[10px] font-bold text-emerald-400">확인된 사실</span>
                  <span class="rounded-full bg-blue-400/15 px-2.5 py-1 text-[10px] font-bold text-blue-400">QQQ · AAPL</span>
                </div>
                <p class="text-xs font-semibold leading-snug text-white">정책 발언 이후 금리 민감 성장주 반응 체크</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════
         2. PROBLEM AGITATION — Pain Point 공감
         목적: 타겟의 불편을 언어화해 공감 형성
    ════════════════════════════════════════════ -->
    <section class="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl text-center">
        <p class="text-xs font-bold uppercase tracking-widest text-amber-500">혹시 이런 경험 있으신가요?</p>
        <h2 class="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
          미국주식 정보, 찾는 것만 해도<br />
          <span class="text-slate-400">지칩니다</span>
        </h2>
      </div>
      <div class="mx-auto mt-12 max-w-4xl grid grid-cols-1 gap-4 sm:grid-cols-2">
        <!-- Pain 1 -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6">
          <div class="mb-3 text-2xl">🌐</div>
          <h3 class="font-bold text-slate-900">영어 뉴스는 빠른데, 번역이 느리다</h3>
          <p class="mt-2 text-sm leading-7 text-slate-500">
            미국 현지 뉴스는 영어로 올라오고, 한국어 번역은 몇 시간씩 늦는다. 중요한 이슈를 늦게 아는 경우가 잦다.
          </p>
        </div>
        <!-- Pain 2 -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6">
          <div class="mb-3 text-2xl">🔀</div>
          <h3 class="font-bold text-slate-900">루머와 사실이 뒤섞여 판단이 어렵다</h3>
          <p class="mt-2 text-sm leading-7 text-slate-500">
            SNS에서 퍼지는 이슈가 확인된 사실인지 루머인지 구분이 안 된다. 잘못된 정보에 반응하기 쉽다.
          </p>
        </div>
        <!-- Pain 3 -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6">
          <div class="mb-3 text-2xl">📂</div>
          <h3 class="font-bold text-slate-900">사이트를 5개씩 열어야 한다</h3>
          <p class="mt-2 text-sm leading-7 text-slate-500">
            뉴스는 야후파이낸스, ETF는 ETF.com, 내부자 거래는 OpenInsider, 리포트는 시킹알파... 한 번에 볼 수 있는 곳이 없다.
          </p>
        </div>
        <!-- Pain 4 -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6">
          <div class="mb-3 text-2xl">⏰</div>
          <h3 class="font-bold text-slate-900">정보를 찾다가 정작 흐름을 놓친다</h3>
          <p class="mt-2 text-sm leading-7 text-slate-500">
            각 정보를 따로 찾아다니다 보면 시간이 지나 정작 시장의 큰 흐름이나 종목 움직임을 놓치는 경우가 생긴다.
          </p>
        </div>
      </div>
      <!-- Bridge -->
      <div class="mx-auto mt-10 max-w-xl text-center">
        <p class="text-base font-semibold text-slate-700">
          이제 한 앱에서 해결하는 방법이 있습니다.
        </p>
      </div>
    </section>

    <!-- ════════════════════════════════════════════
         3. SOLUTION — Before / After + 3단계 워크플로
         목적: 제품이 문제를 어떻게 해결하는지 명확히 제시
    ════════════════════════════════════════════ -->
    <section class="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <div class="mb-12 text-center">
          <p class="text-xs font-bold uppercase tracking-widest text-amber-500">Solution</p>
          <h2 class="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            스톡핑은 흩어진 미국주식 정보를<br />
            <span class="text-amber-500">하나로 모읍니다</span>
          </h2>
          <p class="mt-4 text-slate-500">
            여러 사이트를 오가는 대신, 스톡핑 하나에서 매일 확인하는 습관을 만드세요.
          </p>
        </div>

        <!-- Before / After table -->
        <div class="mx-auto mb-16 max-w-3xl overflow-hidden rounded-2xl border border-slate-200">
          <div class="grid grid-cols-2">
            <div class="border-b border-r border-slate-200 bg-slate-100 px-6 py-4 text-center text-sm font-bold text-slate-500">
              기존 방법
            </div>
            <div class="border-b border-slate-200 bg-amber-50 px-6 py-4 text-center text-sm font-bold text-amber-700">
              스톡핑
            </div>
            <!-- Row 1 -->
            <div class="border-b border-r border-slate-100 px-6 py-4 text-sm text-slate-600">🌐 영어 뉴스 직접 번역</div>
            <div class="border-b border-slate-100 px-6 py-4 text-sm text-slate-800">✅ 한국어 뉴스 번역 제공</div>
            <!-- Row 2 -->
            <div class="border-b border-r border-slate-100 px-6 py-4 text-sm text-slate-600">🔀 루머·사실 구분 불가</div>
            <div class="border-b border-slate-100 px-6 py-4 text-sm text-slate-800">✅ 확인된 사실·관측·루머 분류</div>
            <!-- Row 3 -->
            <div class="border-b border-r border-slate-100 px-6 py-4 text-sm text-slate-600">📂 사이트 5개+ 오가기</div>
            <div class="border-b border-slate-100 px-6 py-4 text-sm text-slate-800">✅ 뉴스·ETF·리포트·내부자 거래 한곳</div>
            <!-- Row 4 -->
            <div class="border-r border-slate-100 px-6 py-4 text-sm text-slate-600">⏰ 정보 찾다 흐름 놓침</div>
            <div class="px-6 py-4 text-sm text-slate-800">✅ 매일 핵심 이슈 정리 제공</div>
          </div>
        </div>

        <!-- 3-step workflow -->
        <div class="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div class="text-center">
            <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-xl font-black text-slate-900">1</div>
            <h3 class="text-base font-bold text-slate-900">이슈 확인</h3>
            <p class="mt-3 text-sm leading-7 text-slate-500">
              오늘의 이슈 레이더에서 확인된 사실·시장 관측·루머를 한눈에 확인합니다.
            </p>
          </div>
          <div class="text-center">
            <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-xl font-black text-slate-900">2</div>
            <h3 class="text-base font-bold text-slate-900">데이터 분석</h3>
            <p class="mt-3 text-sm leading-7 text-slate-500">
              관련 종목의 뉴스·애널리스트 리포트·ETF 비중·내부자 거래를 앱에서 이어서 확인합니다.
            </p>
          </div>
          <div class="text-center">
            <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-xl font-black text-slate-900">3</div>
            <h3 class="text-base font-bold text-slate-900">스스로 판단</h3>
            <p class="mt-3 text-sm leading-7 text-slate-500">
              추천주 없이, 내가 직접 확인한 데이터를 바탕으로 투자 판단을 내립니다.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════
         4. SOCIAL PROOF — 신뢰 지표
         목적: 전환 불안 해소 + 신뢰 구축
    ════════════════════════════════════════════ -->
    <section class="border-y border-slate-200 bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <p class="mb-8 text-center text-xs font-bold uppercase tracking-widest text-slate-400">Why 스톡핑?</p>
        <div class="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
          <div>
            <p class="text-3xl font-bold text-slate-900">매일</p>
            <p class="mt-1 text-xs text-slate-500">미국장 핵심 이슈 업데이트</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-slate-900">3가지</p>
            <p class="mt-1 text-xs text-slate-500">사실·관측·루머 분류 제공</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-slate-900">6개+</p>
            <p class="mt-1 text-xs text-slate-500">통합 정보 카테고리</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-slate-900">무료</p>
            <p class="mt-1 text-xs text-slate-500">기본 기능 다운로드</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════
         5. FEATURES — 6개 핵심 기능
         목적: 핵심 가치 제안을 구체적으로 전달
    ════════════════════════════════════════════ -->
    <section class="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <div class="mb-12 text-center">
          <p class="text-xs font-bold uppercase tracking-widest text-amber-500">Features</p>
          <h2 class="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">하나의 앱에서 모두 확인</h2>
          <p class="mt-4 text-slate-500">미국주식 투자자가 매일 확인해야 할 정보를 6개 카테고리로 정리했습니다.</p>
        </div>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Feature 1 -->
          <div class="rounded-2xl bg-slate-50 p-7">
            <div class="mb-4 text-3xl">📰</div>
            <h3 class="text-lg font-bold text-slate-900">뉴스 번역</h3>
            <p class="mt-3 text-sm leading-7 text-slate-500">
              미국 현지 영어 뉴스를 한국어로 빠르게 확인합니다. 영어 장벽 없이 미국장 소식을 실시간으로 파악합니다.
            </p>
          </div>
          <!-- Feature 2 -->
          <div class="rounded-2xl bg-slate-50 p-7">
            <div class="mb-4 text-3xl">🎯</div>
            <h3 class="text-lg font-bold text-slate-900">이슈 레이더</h3>
            <p class="mt-3 text-sm leading-7 text-slate-500">
              오늘의 미국장 이슈를 확인된 사실·시장 관측·루머 세 가지로 분류해 정리합니다. SNS 루머를 사실처럼 믿는 일을 줄입니다.
            </p>
          </div>
          <!-- Feature 3 -->
          <div class="rounded-2xl bg-slate-50 p-7">
            <div class="mb-4 text-3xl">📊</div>
            <h3 class="text-lg font-bold text-slate-900">애널리스트 리포트</h3>
            <p class="mt-3 text-sm leading-7 text-slate-500">
              주요 증권사의 목표가·투자등급 변화를 한눈에 확인합니다. 어닝콜 요약도 제공합니다.
            </p>
          </div>
          <!-- Feature 4 -->
          <div class="rounded-2xl bg-slate-50 p-7">
            <div class="mb-4 text-3xl">🗂️</div>
            <h3 class="text-lg font-bold text-slate-900">ETF 네비게이터</h3>
            <p class="mt-3 text-sm leading-7 text-slate-500">
              QQQ·SCHD·SPY 등 주요 ETF의 보유 종목·비중·배당·수수료를 한곳에서 분석합니다.
            </p>
          </div>
          <!-- Feature 5 -->
          <div class="rounded-2xl bg-slate-50 p-7">
            <div class="mb-4 text-3xl">🕵️</div>
            <h3 class="text-lg font-bold text-slate-900">내부자 거래</h3>
            <p class="mt-3 text-sm leading-7 text-slate-500">
              CEO·임원진의 실제 주식 매수·매도 데이터를 확인합니다. 회사 내부 신호를 직접 확인하세요.
            </p>
          </div>
          <!-- Feature 6 -->
          <div class="rounded-2xl bg-slate-50 p-7">
            <div class="mb-4 text-3xl">🏛️</div>
            <h3 class="text-lg font-bold text-slate-900">상하원 의원 매매</h3>
            <p class="mt-3 text-sm leading-7 text-slate-500">
              미국 상하원 의원의 주식 거래 내역을 추적합니다. 정치·정책 흐름과 연계해 확인할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════
         6. OFFER / PRICING — 무료 vs. 인앱 결제
         목적: 가격 불안 해소 + 무료 진입 장벽 낮추기
    ════════════════════════════════════════════ -->
    <section class="bg-slate-900 px-4 py-20 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl">
        <div class="mb-10 text-center">
          <p class="text-xs font-bold uppercase tracking-widest text-amber-400">Pricing</p>
          <h2 class="mt-3 text-3xl font-bold text-white sm:text-4xl">먼저 무료로 시작하세요</h2>
          <p class="mt-4 text-slate-400">기본 기능은 무료입니다. 더 깊은 분석은 앱 내 결제로 이용할 수 있습니다.</p>
        </div>
        <div class="overflow-hidden rounded-2xl border border-slate-700">
          <!-- Header row -->
          <div class="grid grid-cols-2 border-b border-slate-700">
            <div class="bg-slate-800 px-6 py-4 text-center text-sm font-bold text-slate-300">무료</div>
            <div class="bg-amber-400/10 px-6 py-4 text-center text-sm font-bold text-amber-400">인앱 결제</div>
          </div>
          <!-- Rows -->
          <div class="grid grid-cols-2">
            <div class="border-b border-r border-slate-700/50 px-6 py-3.5 text-sm text-slate-300">✅ 뉴스 번역</div>
            <div class="border-b border-slate-700/50 px-6 py-3.5 text-sm text-amber-300">✅ 애널리스트 리포트 상세</div>
            <div class="border-b border-r border-slate-700/50 px-6 py-3.5 text-sm text-slate-300">✅ 오늘의 이슈 레이더</div>
            <div class="border-b border-slate-700/50 px-6 py-3.5 text-sm text-amber-300">✅ 내부자 거래 전체 데이터</div>
            <div class="border-b border-r border-slate-700/50 px-6 py-3.5 text-sm text-slate-300">✅ 기본 ETF 정보</div>
            <div class="border-b border-slate-700/50 px-6 py-3.5 text-sm text-amber-300">✅ 상하원 의원 매매 전체</div>
            <div class="border-r border-slate-700/50 px-6 py-3.5 text-sm text-slate-300">✅ 관심종목 등록</div>
            <div class="px-6 py-3.5 text-sm text-amber-300">✅ AI 포트폴리오 분석</div>
          </div>
        </div>
        <div class="mt-8 flex justify-center">
          <TrackedCtaButton
            client:load
            href={links.playStore}
            label="무료로 다운로드하기"
            page="index"
            section="pricing"
            variant="primary"
          />
        </div>
        <p class="mt-3 text-center text-xs text-slate-600">현재 Android(구글 플레이) 서비스 중 · iOS 버전 준비 중</p>
      </div>
    </section>

    <!-- ════════════════════════════════════════════
         7. FAQ — 자주 묻는 질문
    ════════════════════════════════════════════ -->
    <section class="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl">
        <div class="mb-10 text-center">
          <p class="text-xs font-bold uppercase tracking-widest text-amber-500">FAQ</p>
          <h2 class="mt-3 text-3xl font-bold text-slate-900">자주 묻는 질문</h2>
        </div>
        <FaqAccordion client:load />
      </div>
    </section>

    <!-- ════════════════════════════════════════════
         8. FINAL CTA — 최종 다운로드 유도
         목적: 마지막 전환 기회
    ════════════════════════════════════════════ -->
    <section class="bg-slate-900 px-4 py-24 text-center sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl">
        <p class="text-xs font-bold uppercase tracking-widest text-amber-400">지금 바로</p>
        <h2 class="mt-4 text-3xl font-bold text-white sm:text-4xl">
          오늘 미국장 열리기 전에,<br />
          확인해야 할 정보가 있습니다
        </h2>
        <p class="mt-4 text-slate-400">
          뉴스·루머·리포트·ETF 분석·내부자 거래까지 스톡핑에서 무료로 확인하세요.
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-4">
          <TrackedCtaButton
            client:load
            href={links.playStore}
            label="플레이스토어에서 무료 다운로드"
            page="index"
            section="final-cta"
            variant="primary"
          />
          <a
            href="/radar"
            class="inline-flex items-center justify-center rounded-xl border border-slate-600 bg-slate-800 px-8 py-4 text-base font-semibold text-slate-200 transition hover:bg-slate-700"
          >
            오늘의 이슈 레이더 보기 →
          </a>
        </div>
        <p class="mt-4 text-xs text-slate-600">현재 Android(구글 플레이) 서비스 중 · iOS 버전 준비 중</p>
        <!-- Legal disclaimer -->
        <p class="mt-6 text-[11px] leading-6 text-slate-700">
          스톡핑은 투자 판단을 돕는 정보 제공 앱이며, 특정 종목의 매수·매도를 추천하지 않습니다.
        </p>
      </div>
    </section>

  </BaseLayout>
  ```

- [ ] **Step 2: TrackedCtaButton `variant="primary"` 지원 확인**

  `src/components/islands/TrackedCtaButton.tsx`를 읽어 `variant="primary"` prop이 지원되는지 확인한다. 기존에 `primary` variant가 없다면 `variant="primary"`를 amber 스타일로 추가한다.

  Run: `grep -n "variant\|primary\|secondary" src/components/islands/TrackedCtaButton.tsx`

  Expected: `primary` variant가 있거나, 기존 variant명을 확인한다.

  만약 `primary` variant가 없다면 기존 variant명(예: `"default"`)으로 교체하거나, `variant` prop에 `primary` 케이스를 추가한다.

- [ ] **Step 3: 빌드 통과 확인**

  Run: `npm run build`

  Expected: 빌드 성공. TypeScript·Astro 오류 없음.

- [ ] **Step 4: Commit**

  ```bash
  git add src/pages/index.astro
  git commit -m "feat: rewrite landing page with 8-section spec (HERO·PROBLEM·SOLUTION·SOCIAL·FEATURES·OFFER·FAQ·CTA)"
  ```
