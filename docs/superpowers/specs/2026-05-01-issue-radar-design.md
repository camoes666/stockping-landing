# Issue Radar Landing Design

**Project:** 미국장 앱 유입용 회사 도메인 사이트

**Primary Goal:** 쇼츠, 틱톡, 쓰레드 등 SNS 유입 사용자를 받아 `오늘의 미국장 이슈 레이더` 페이지에서 신뢰를 형성하고 플레이스토어 다운로드로 전환한다.

**Secondary Goal:** 향후 회사 도메인 블로그를 같은 정보구조 안에서 확장할 수 있도록 기반을 마련한다.

## Product Summary

이 프로젝트의 1차 범위는 마케팅 랜딩과 일일 이슈 레이더다. 사용자는 SNS에서 특정 이슈를 보고 들어오며, 사이트는 오늘의 핵심 미국장 이슈 3~5개를 간결하게 보여준다. 각 이슈는 `확인된 사실`, `시장 관측`, `투자자가 볼 포인트`를 구분해 제시하고, 앱에서 더 자세히 볼 수 있는 데이터와 연결된다.

이 사이트는 뉴스 미디어가 아니라 앱 전환용 정보 페이지다. 따라서 긴 기사형 편집보다 빠른 스캔, 신뢰 문구, 명확한 CTA가 우선이다.

## Recommended Stack

- Framework: Astro
- Interactive UI islands: React
- Hosting: Cloudflare Pages
- Data store / admin-friendly backend: Supabase
- Domain: 회사 도메인 하위 경로 기반 운영

## Why This Stack

### Astro

이번 프로젝트는 콘텐츠 중심이고 첫 로딩 속도와 SEO가 중요하다. Astro는 기본적으로 정적 HTML을 잘 만들고, 필요한 부분만 React island로 올릴 수 있어 이슈 레이더와 랜딩 페이지에 잘 맞는다.

### React Components

FAQ 아코디언, 필터, 이슈 카드 인터랙션, CTA 추적 같은 작은 상호작용은 React island로 처리하면 된다. 앱 수준의 복잡한 클라이언트 상태가 아니라서 전체를 React SPA로 만들 필요는 없다.

### Cloudflare Pages

정적 사이트 배포와 미리보기 환경이 가볍고 빠르다. Astro와 궁합이 좋고, 회사 도메인 연결도 straightforward하다.

### Supabase

운영자가 이슈 카드 데이터를 관리하거나 향후 간단한 CMS 흐름을 붙이기 좋다. 1차 버전에서는 일일 이슈 데이터, CTA 클릭 로그, 간단한 콘텐츠 관리 정도를 담당하면 충분하다.

## Information Architecture

### Phase 1

- `/`
  - 메인 랜딩
- `/radar`
  - 오늘의 미국장 이슈 레이더
- `/privacy`
  - 개인정보 처리 관련 기본 페이지
- `/terms`
  - 필요 시 약관/고지 페이지

### Phase 2

- `/blog`
  - 회사 도메인 블로그
- `/blog/[slug]`
  - SEO용 개별 글

블로그는 이번 1차 구현 범위에 넣지 않는다. 다만 헤더, 푸터, 라우트 구조, SEO 메타 설계는 나중에 `/blog`를 자연스럽게 추가할 수 있게 잡는다.

## Core User Flow

1. 사용자가 SNS에서 미국장 관련 숏폼 콘텐츠를 본다.
2. 링크를 통해 `이슈 레이더` 또는 메인 랜딩으로 들어온다.
3. 오늘의 이슈 3~5개를 빠르게 스캔한다.
4. 각 이슈에서 사실과 시장 관측이 분리되어 있음을 확인하고 신뢰를 얻는다.
5. “앱에서 자세히 보기” 또는 플레이스토어 CTA를 누른다.
6. 앱 다운로드로 전환된다.

## Radar Page Structure

### Hero

- 페이지명: `오늘의 미국장 이슈 레이더`
- 보조 문구: 오늘 시장에서 많이 언급되는 이슈를 사실과 시장 관측으로 나눠서 보여준다는 설명
- 주요 CTA: `플레이스토어에서 앱 받기`

### Daily Issue List

하루 3~5개 이슈 카드로 구성한다.

각 카드 필드:

- 이슈 제목
- 구분: `확인된 사실` / `시장 관측` / `루머`
- 관련 종목
- 확인된 사실
- 시장 관측
- 투자자가 볼 포인트
- 앱에서 확인 가능한 데이터
- CTA: `앱에서 자세히 보기`

### Trust / Method Section

- 데이터와 해석을 구분한다는 원칙
- 특정 종목 추천이 아니라는 점
- 앱에서 확인 가능한 데이터 범주 예시
  - 뉴스 번역
  - ETF 관련 흐름
  - 내부자/정책/시장 이슈 연결 데이터

### Final CTA

- “오늘 시장 이슈를 더 빠르게 보려면 앱에서 확인”
- 플레이스토어 버튼

### Disclaimer

`루머성 이슈는 확인된 사실과 시장 관측을 구분해 제공합니다. 본 페이지는 투자 판단을 돕기 위한 정보 제공 목적이며, 특정 종목의 매수·매도 추천이 아닙니다.`

## Content Model

Supabase 기준 최소 데이터 모델:

### `daily_issue_sets`

- `id`
- `publish_date`
- `title`
- `status` (`draft`, `published`)
- `created_at`
- `updated_at`

### `daily_issues`

- `id`
- `issue_set_id`
- `sort_order`
- `headline`
- `category` (`fact`, `observation`, `rumor`)
- `related_symbols` (text array)
- `confirmed_facts`
- `market_observation`
- `investor_watchpoints`
- `app_data_points`
- `cta_label`
- `created_at`
- `updated_at`

### `cta_events` (Phase 1 필수 — 전환율 측정 수단)

- `id`
- `source_page`
- `source_section`
- `campaign`
- `created_at`

> 이 테이블 없이는 플레이스토어 전환율을 측정할 방법이 없다. anon role은 INSERT만 허용하고 SELECT/DELETE는 RLS로 차단한다.

## Rendering Strategy

- 메인 랜딩과 레이더 페이지는 SSG 우선
- 일일 이슈 데이터는 빌드 시점 또는 재배포 기준으로 반영
- 초기 버전은 “운영자가 이슈 업데이트 후 재배포” 모델로 시작
- 추후 필요하면 SSR 또는 Edge rendering으로 확장

이 선택은 운영 단순성을 위한 것이다. 1차 목적은 빠른 출시와 신뢰 가능한 정적 페이지 운영이다.

## SEO Strategy

### Phase 1 SEO

- 회사 도메인에 메인 랜딩과 레이더 페이지를 올린다.
- `오늘의 미국장 이슈`, `미국주식 이슈`, `미국장 루머`, `미국증시 오늘 이슈` 등 검색 의도를 반영한 title/description을 설계한다.
- Open Graph 메타를 페이지별로 분리한다.

### Phase 2 SEO

- 블로그는 회사 도메인 하위 경로 `/blog` 로 붙인다.
- 같은 프로젝트 안에서 Astro collection 또는 CMS 연동으로 확장하는 방향을 우선 추천한다.

## Design Principles

- 카드형 정보 구조는 촘촘하되 과장되지 않게
- 금융/데이터 제품답게 차분하고 신뢰감 있는 톤
- “루머”는 라벨 중 하나로만 쓰고 브랜드 전면 용어는 `이슈 레이더`
- 모바일 우선
- Hero부터 첫 카드 일부가 보이도록 구성해 스크롤 동기를 만든다

## Analytics

최소 추적 항목:

- 페이지 유입 경로 파라미터
- Hero CTA 클릭
- 각 이슈 카드 CTA 클릭
- 최종 CTA 클릭

도구는 Cloudflare Web Analytics 또는 별도 경량 분석 도구를 우선 검토한다.

## Risks And Decisions

### Risk 1: 콘텐츠 운영 부담

이슈 레이더는 매일 3~5개 이슈를 정리해야 해서 운영 부담이 생긴다. 따라서 초기 데이터 구조와 입력 폼은 간단해야 한다.

### Risk 2: 법적/신뢰 인식

투자 추천으로 오해받지 않도록 카드 구조와 하단 고지 문구를 명확히 유지해야 한다.

### Risk 3: Astro 범위 오판

향후 제품이 로그인 기반 웹앱으로 커지면 Astro보다 다른 프레임워크가 편할 수 있다. 하지만 현재 범위는 콘텐츠/전환 중심이므로 Astro가 적합하다.

## Non-Goals For Phase 1

- 회사 도메인 블로그 전체 구현
- 사용자 로그인
- 복잡한 관리자 대시보드
- 실시간 소켓 기반 시장 데이터
- 종목 추천/매매 신호 기능

## Build Recommendation

1차 릴리스는 `Astro + React islands + Cloudflare Pages + Supabase` 조합으로 간다.

구현 범위는 `메인 랜딩 + 오늘의 미국장 이슈 레이더 + 기본 법적 페이지 + CTA 추적 준비`까지로 제한한다.

블로그는 같은 도메인 전략 안에서 2단계로 추가한다.
