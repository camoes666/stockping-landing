# Issue Radar Supabase Integration — Design Spec

## Goal

이슈 레이더 데이터를 하드코딩된 TypeScript 파일(`src/data/daily-issues.ts`)에서 Supabase DB로 이전한다. 레이더 페이지를 SSR로 전환해 배포 없이 Supabase 대시보드에서 이슈를 즉시 추가·수정·발행할 수 있게 한다.

## Architecture

레이더 페이지(`src/pages/radar.astro`)에서 `prerender = true`를 제거하고, 매 요청마다 Supabase에서 `is_published = true`인 이슈를 조회해 렌더링한다. Supabase 클라이언트는 기존 `src/lib/supabase.ts`를 재사용한다. 쿼리 실패 시 기존 하드코딩 데이터로 폴백해 페이지가 빈 채로 뜨는 일을 방지한다.

## Tech Stack

- Supabase (기존 연결 — `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`)
- Astro v6 SSR on Cloudflare Workers
- 기존 `src/lib/supabase.ts` 클라이언트

---

## DB Schema

Supabase에서 직접 SQL로 생성한다.

```sql
create table daily_issues (
  id           bigserial primary key,
  created_at   timestamptz not null default now(),
  headline     text        not null,
  category     text        not null check (category in ('확인된 사실', '시장 관측', '루머')),
  related_symbols  text[]  not null default '{}',
  confirmed_facts  text    not null,
  market_observation text  not null,
  watch_points     text[]  not null default '{}',
  app_data_points  text[]  not null default '{}',
  is_published boolean     not null default false,
  display_order int        not null default 0
);

-- 조회 성능용 인덱스
create index on daily_issues (is_published, display_order, created_at desc);
```

### RLS (Row Level Security)

- 읽기: `is_published = true`인 행은 anon key로 읽기 허용
- 쓰기: anon key로 쓰기 불가 (Supabase 대시보드 또는 service role key만 가능)

```sql
alter table daily_issues enable row level security;

create policy "published issues are readable by everyone"
  on daily_issues for select
  using (is_published = true);
```

---

## 조회 로직

```typescript
// is_published = true 인 이슈만, display_order 오름차순 → created_at 내림차순, 최대 10개
const { data, error } = await supabase
  .from("daily_issues")
  .select("*")
  .eq("is_published", true)
  .order("display_order", { ascending: true })
  .order("created_at", { ascending: false })
  .limit(10);
```

---

## 타입 정의

`src/lib/supabase.ts`에 DB 행 타입을 추가한다:

```typescript
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
```

`DailyIssueRow`를 기존 `DailyIssue` 타입과 호환되도록 변환하는 함수:

```typescript
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

---

## 레이더 페이지 변경

`src/pages/radar.astro`:

1. `export const prerender = true;` 제거 → SSR
2. frontmatter에서 Supabase fetch + 폴백 로직 추가:

```typescript
import { supabase, rowToIssue } from "../lib/supabase";
import { dailyIssues } from "../data/daily-issues"; // 폴백

let issues = dailyIssues; // 기본값 = 폴백
if (supabase) {
  const { data, error } = await supabase
    .from("daily_issues")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(10);
  if (!error && data && data.length > 0) {
    issues = data.map(rowToIssue);
  }
}
```

3. 템플릿의 `dailyIssues` → `issues`로 교체

---

## 폴백 동작

| 상황 | 동작 |
|---|---|
| Supabase 연결 정상, 발행된 이슈 있음 | DB 데이터 표시 |
| Supabase 연결 정상, 발행된 이슈 없음 | 폴백 데이터 표시 |
| Supabase 연결 실패 (env 없음 등) | 폴백 데이터 표시 |
| Supabase 쿼리 에러 | 폴백 데이터 표시 |

---

## 이슈 작성 방법 (Supabase 대시보드)

1. Supabase 대시보드 → Table Editor → `daily_issues`
2. `+ Insert row` 클릭
3. 필드 입력:
   - `headline`: 이슈 제목
   - `category`: `확인된 사실` / `시장 관측` / `루머` 중 하나
   - `related_symbols`: `["NVDA","AMD"]` 형식
   - `confirmed_facts`: 확인된 사실 텍스트
   - `market_observation`: 시장 관측 텍스트
   - `watch_points`: `["포인트1","포인트2"]` 형식
   - `app_data_points`: `["뉴스 번역","ETF 흐름"]` 형식
   - `display_order`: 위에서부터 순서 (0, 1, 2...)
   - `is_published`: `false`로 저장 후 준비되면 `true`로 변경해 발행

---

## 변경 파일 목록

| 파일 | 변경 내용 |
|---|---|
| `src/lib/supabase.ts` | `DailyIssueRow` 타입 + `rowToIssue()` 함수 추가 |
| `src/pages/radar.astro` | `prerender` 제거, Supabase fetch + 폴백 로직 추가 |
| `src/data/daily-issues.ts` | 변경 없음 (폴백용으로 유지) |
| `src/components/radar/IssueCard.astro` | 변경 없음 |

---

## 범위 밖 (Phase 2)

- 자동화 파이프라인 (FMP/Polygon API + LLM 생성)
- 블로그 글 자동화
- 이슈 관리 어드민 UI
- Cloudflare 캐시 헤더
