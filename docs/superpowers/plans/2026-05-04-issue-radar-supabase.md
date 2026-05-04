# Issue Radar Supabase Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 이슈 레이더 데이터를 Supabase DB에서 읽도록 전환하고, 배포 없이 Supabase 대시보드에서 이슈를 즉시 발행할 수 있게 한다.

**Architecture:** `src/pages/radar.astro`에서 `prerender = true`를 제거해 SSR로 전환한다. 매 요청마다 Supabase에서 `is_published = true`인 이슈를 조회하고, 실패 시 하드코딩 폴백 데이터를 표시한다. `src/lib/supabase.ts`에 DB 행 타입과 변환 함수를 추가해 기존 `IssueCard` 컴포넌트와 호환성을 유지한다.

**Tech Stack:** Supabase (`@supabase/supabase-js` 2.x, 이미 설치됨), Astro v6 SSR on Cloudflare Workers, Vitest

---

## File Structure

| 파일 | 변경 |
|---|---|
| `src/lib/supabase.ts` | `DailyIssueRow` 인터페이스 + `rowToIssue()` 함수 추가 |
| `src/lib/supabase.test.ts` | `rowToIssue()` 단위 테스트 (신규) |
| `src/pages/radar.astro` | `prerender` 제거, Supabase fetch + 폴백 로직 추가 |
| `src/data/daily-issues.ts` | 변경 없음 (폴백용 유지) |
| `src/components/radar/IssueCard.astro` | 변경 없음 |

---

### Task 1: Supabase 테이블 생성 (수동 작업)

**Files:** 없음 (Supabase 대시보드에서 직접 실행)

이 태스크는 코드 변경이 없다. Supabase SQL Editor에서 아래 SQL을 직접 실행해 테이블을 만든다.

- [ ] **Step 1: Supabase 대시보드 → SQL Editor 열기**

  `https://supabase.com/dashboard` → 프로젝트 선택 → 좌측 메뉴 "SQL Editor"

- [ ] **Step 2: 테이블 생성 SQL 실행**

  아래 SQL을 붙여넣고 "Run" 클릭:

  ```sql
  create table daily_issues (
    id                 bigserial    primary key,
    created_at         timestamptz  not null default now(),
    headline           text         not null,
    category           text         not null check (category in ('확인된 사실', '시장 관측', '루머')),
    related_symbols    text[]       not null default '{}',
    confirmed_facts    text         not null,
    market_observation text         not null,
    watch_points       text[]       not null default '{}',
    app_data_points    text[]       not null default '{}',
    is_published       boolean      not null default false,
    display_order      int          not null default 0
  );

  create index on daily_issues (is_published, display_order, created_at desc);
  ```

  Expected: "Success. No rows returned"

- [ ] **Step 3: RLS 설정 SQL 실행**

  같은 SQL Editor에서 이어서 실행:

  ```sql
  alter table daily_issues enable row level security;

  create policy "published issues are readable by everyone"
    on daily_issues for select
    using (is_published = true);
  ```

  Expected: "Success. No rows returned"

- [ ] **Step 4: 테스트 데이터 삽입**

  페이지 동작 확인용 샘플 이슈 1건 삽입:

  ```sql
  insert into daily_issues
    (headline, category, related_symbols, confirmed_facts, market_observation, watch_points, app_data_points, is_published, display_order)
  values
    (
      '테스트: 반도체 대형주 실적 기대',
      '시장 관측',
      array['NVDA', 'AMD'],
      '실적 발표 일정이 공개됐다.',
      '단기 변동성이 커질 수 있다는 해석이 나온다.',
      array['ETF 자금 흐름 확인', '장중 섹터 동반 움직임 체크'],
      array['뉴스 번역', '관련 ETF 흐름'],
      true,
      0
    );
  ```

  Expected: "1 row inserted"

- [ ] **Step 5: 삽입 확인**

  ```sql
  select id, headline, is_published from daily_issues;
  ```

  Expected: 1행, `is_published = true`

---

### Task 2: `supabase.ts`에 타입과 변환 함수 추가

**Files:**
- Modify: `src/lib/supabase.ts`
- Create: `src/lib/supabase.test.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

  `src/lib/supabase.test.ts` 신규 생성:

  ```typescript
  import { describe, it, expect } from "vitest";
  import { rowToIssue } from "./supabase";
  import type { DailyIssueRow } from "./supabase";

  const sampleRow: DailyIssueRow = {
    id: 1,
    created_at: "2026-05-04T00:00:00Z",
    headline: "테스트 이슈",
    category: "시장 관측",
    related_symbols: ["NVDA", "AMD"],
    confirmed_facts: "확인된 사실 텍스트",
    market_observation: "시장 관측 텍스트",
    watch_points: ["포인트1", "포인트2"],
    app_data_points: ["데이터1"],
    is_published: true,
    display_order: 0,
  };

  describe("rowToIssue", () => {
    it("maps snake_case DB columns to camelCase DailyIssue fields", () => {
      const issue = rowToIssue(sampleRow);
      expect(issue.headline).toBe("테스트 이슈");
      expect(issue.category).toBe("시장 관측");
      expect(issue.relatedSymbols).toEqual(["NVDA", "AMD"]);
      expect(issue.confirmedFacts).toBe("확인된 사실 텍스트");
      expect(issue.marketObservation).toBe("시장 관측 텍스트");
      expect(issue.watchPoints).toEqual(["포인트1", "포인트2"]);
      expect(issue.appDataPoints).toEqual(["데이터1"]);
    });

    it("does not include id, created_at, is_published, or display_order in the result", () => {
      const issue = rowToIssue(sampleRow) as Record<string, unknown>;
      expect(issue["id"]).toBeUndefined();
      expect(issue["created_at"]).toBeUndefined();
      expect(issue["is_published"]).toBeUndefined();
      expect(issue["display_order"]).toBeUndefined();
    });
  });
  ```

- [ ] **Step 2: 테스트 실패 확인**

  Run: `npm test -- supabase`

  Expected: FAIL — `rowToIssue is not exported from './supabase'`

- [ ] **Step 3: `src/lib/supabase.ts` 수정**

  현재 파일을 읽고 아래 내용으로 교체한다:

  ```typescript
  import { createClient } from "@supabase/supabase-js";
  import type { DailyIssue } from "../data/daily-issues";

  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? "";

  export const supabase =
    supabaseUrl && supabaseAnonKey
      ? createClient(supabaseUrl, supabaseAnonKey)
      : null;

  export interface DailyIssueRow {
    id: number;
    created_at: string;
    headline: string;
    category: "확인된 사실" | "시장 관측" | "루머";
    related_symbols: string[];
    confirmed_facts: string;
    market_observation: string;
    watch_points: string[];
    app_data_points: string[];
    is_published: boolean;
    display_order: number;
  }

  export function rowToIssue(row: DailyIssueRow): DailyIssue {
    return {
      headline: row.headline,
      category: row.category,
      relatedSymbols: row.related_symbols,
      confirmedFacts: row.confirmed_facts,
      marketObservation: row.market_observation,
      watchPoints: row.watch_points,
      appDataPoints: row.app_data_points,
    };
  }
  ```

- [ ] **Step 4: 테스트 통과 확인**

  Run: `npm test -- supabase`

  Expected: PASS — 2 tests passed

- [ ] **Step 5: 전체 테스트 통과 확인**

  Run: `npm test`

  Expected: 모든 기존 테스트 포함 전체 PASS (기존 테스트가 `supabase.ts`를 직접 임포트하지 않으므로 영향 없음)

- [ ] **Step 6: Commit**

  ```bash
  git add src/lib/supabase.ts src/lib/supabase.test.ts
  git commit -m "feat: add DailyIssueRow type and rowToIssue() to supabase client"
  ```

---

### Task 3: `radar.astro`를 SSR + Supabase fetch로 전환

**Files:**
- Modify: `src/pages/radar.astro`

- [ ] **Step 1: 현재 `src/pages/radar.astro` 파일 읽기**

  파일 상단의 frontmatter를 확인한다. 현재 구조:
  ```astro
  ---
  export const prerender = true;
  import { dailyIssues } from "../data/daily-issues";
  ...
  ---
  ...{dailyIssues.map(...)}
  ```

- [ ] **Step 2: frontmatter 교체**

  `src/pages/radar.astro` frontmatter를 아래로 교체한다 (`export const prerender = true;` 제거 + fetch 로직 추가):

  ```astro
  ---
  import BaseLayout from "../layouts/BaseLayout.astro";
  import IssueCard from "../components/radar/IssueCard.astro";
  import { CtaButton } from "../components/ui/CtaButton";
  import { dailyIssues } from "../data/daily-issues";
  import { supabase, rowToIssue } from "../lib/supabase";
  import type { DailyIssueRow } from "../lib/supabase";
  import { siteConfig } from "../config/site";
  import { links } from "../config/links";
  import type { DailyIssue } from "../data/daily-issues";

  let issues: DailyIssue[] = dailyIssues; // 기본값 = 폴백

  if (supabase) {
    const { data, error } = await supabase
      .from("daily_issues")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(10);

    if (!error && data && data.length > 0) {
      issues = (data as DailyIssueRow[]).map(rowToIssue);
    }
  }
  ---
  ```

  그리고 템플릿에서 `dailyIssues` → `issues` 로 변경:

  ```astro
  {issues.map((issue) => <IssueCard issue={issue} />)}
  ```

- [ ] **Step 3: 빌드 통과 확인**

  Run: `npm run build`

  Expected: 빌드 성공. `/radar` 페이지는 더 이상 prerender 목록에 나타나지 않는다 (SSR 페이지이므로).

  빌드 출력에서 `/radar/index.html` 줄이 없어진 것을 확인한다.

- [ ] **Step 4: Commit**

  ```bash
  git add src/pages/radar.astro
  git commit -m "feat: migrate radar page to SSR with Supabase fetch and fallback"
  ```

- [ ] **Step 5: 배포 후 동작 확인**

  ```bash
  git push
  ```

  배포 완료 후 `https://stockping-landing.camoes666.workers.dev/radar` 접속:
  - Supabase에 삽입한 테스트 이슈("테스트: 반도체 대형주 실적 기대")가 표시되면 성공
  - Task 1에서 삽입한 샘플 데이터가 보여야 한다

---

### Task 4: 테스트 데이터 정리 (선택)

**Files:** 없음 (Supabase 대시보드에서 실행)

배포 확인 후 Task 1에서 넣은 테스트 데이터를 실제 이슈로 교체하거나 삭제한다.

- [ ] **Step 1: Supabase Table Editor에서 테스트 행 삭제 또는 수정**

  `daily_issues` 테이블 → id=1 행 선택 → Delete 또는 Edit

- [ ] **Step 2: 실제 이슈 입력**

  아래 구조로 이슈를 새로 추가한다:

  ```sql
  insert into daily_issues
    (headline, category, related_symbols, confirmed_facts, market_observation, watch_points, app_data_points, is_published, display_order)
  values
    (
      '이슈 제목을 여기에',
      '확인된 사실',           -- '확인된 사실' | '시장 관측' | '루머'
      array['AAPL', 'QQQ'],   -- 관련 종목
      '확인된 사실 내용',
      '시장 관측 내용',
      array['체크 포인트1', '체크 포인트2'],
      array['앱 데이터1', '앱 데이터2'],
      true,                   -- 바로 발행하려면 true
      0                       -- 표시 순서 (낮을수록 위)
    );
  ```
