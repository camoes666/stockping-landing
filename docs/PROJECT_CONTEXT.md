# Stockping Landing — 프로젝트 컨텍스트 문서

> **새 세션 시작 시 이 파일을 먼저 읽어 현재 상태를 파악하세요.**
> 마지막 업데이트: 2026-06-01 (SEO 개선, 블로그 내부 링크, 이슈 레이더 날짜별 히스토리)

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 앱 이름 | Stockping (스톡핑) |
| 서비스 | 미국장 이슈 레이더 — 루머·사실·시장관측 구분 |
| 앱 패키지 | `kr.datadnp.app` (Android) |
| GitHub | https://github.com/camoes666/stockping-landing |
| 라이브 URL | **https://stockping-landing.camoes666.workers.dev** |
| 로컬 경로 | `C:\Users\USER\code\datadnp-us-landing` |
| 배포 브랜치 | `release/v0.1.0` |

---

## 2. 기술 스택

| 레이어 | 기술 |
|--------|------|
| 프레임워크 | Astro 6 (`output: "server"`) |
| 어댑터 | `@astrojs/cloudflare` (Cloudflare Workers) |
| UI | React 19 islands + Tailwind CSS v3 |
| 콘텐츠 | MDX (`@astrojs/mdx`) + Astro Content Collections |
| CMS | Keystatic (`@keystatic/astro`) — GitHub 저장 모드 |
| 댓글 | Supabase `comments` 테이블 |
| 분석 | Supabase `cta_events` 테이블 |
| 배포 | Cloudflare Workers (`npx wrangler deploy`) + GitHub Actions 자동 배포 |
| CI/CD | `.github/workflows/deploy.yml` — release/v0.1.0 push 시 자동 배포 |
| 테스트 | Vitest + Testing Library + Playwright |

---

## 3. 환경변수

### 로컬 `.env` (git ignore됨)
```
PUBLIC_SUPABASE_URL=https://jczdryhzgbyvxmughuth.supabase.co
PUBLIC_SUPABASE_ANON_KEY=sb_publishable__fXC9RT_UShJKw_wnD8iig_f-Sr3bcH
KEYSTATIC_GITHUB_CLIENT_ID=0v23limRN6BNTSH7nbSm
KEYSTATIC_GITHUB_CLIENT_SECRET=cd89500272b3f75cd81a4e856be0543b3aef6a46
KEYSTATIC_SECRET=fe651fe768065c2c4c78d85f9bf13ddcdbac9f3ae9f31451ab6ef35d7acec753
```

### Cloudflare Workers Secrets (wrangler secret bulk로 등록 완료)
위 5개 변수가 `stockping-landing` Worker에 등록되어 있음.

### Supabase 프로젝트
- URL: `https://jczdryhzgbyvxmughuth.supabase.co`
- `cta_events` 테이블: 생성 완료 ✅
- `comments` 테이블: **아직 생성 안 됨** ⚠️ (아래 SQL 참고)

---

## 4. 배포 방법

### 빌드 + 배포 (Cloudflare Workers)
```bash
npm run build
npx wrangler deploy
```

> **주의**: `wrangler pages deploy`는 절대 사용하지 말 것.
> `@astrojs/cloudflare`는 Workers 배포용이고, Pages에서는 `ASSETS` binding 이름이 예약어라 충돌 발생.

### wrangler.toml 핵심 주의사항
```toml
name = "stockping-landing"
compatibility_date = "2026-05-01"
# pages_build_output_dir 절대 추가하지 말 것 — ASSETS 충돌 원인
```

### 로컬 개발
```bash
npm run dev
```

---

## 5. 파일 구조

```
src/
├── pages/
│   ├── index.astro          # 메인 랜딩 (prerender=true)
│   ├── radar.astro          # 이슈 레이더 (prerender=true)
│   ├── privacy.astro        # 개인정보처리방침 (prerender=true)
│   ├── terms.astro          # 이용약관 (prerender=true)
│   ├── rss.xml.ts           # RSS 피드 (prerender=true)
│   └── blog/
│       ├── index.astro      # 블로그 목록 (prerender=true)
│       ├── [slug].astro     # 블로그 상세 (prerender=true)
│       └── category/
│           └── [category].astro  # 카테고리 필터 (prerender=true)
│
├── layouts/
│   ├── BaseLayout.astro     # 공통 헤더/푸터
│   └── BlogPostLayout.astro # 블로그 포스트 레이아웃
│
├── components/
│   ├── blog/
│   │   ├── BlogCard.astro       # 블로그 카드 (목록용)
│   │   ├── CTABox.astro         # 블로그 내 CTA 박스
│   │   ├── CommentSection.tsx   # 댓글 (React island, Supabase)
│   │   ├── DisclaimerBox.astro  # 투자 면책 고지
│   │   └── PostMeta.astro       # 날짜/카테고리/태그
│   ├── islands/
│   │   ├── FaqAccordion.tsx     # FAQ 아코디언 (React island)
│   │   └── TrackedCtaButton.tsx # CTA 버튼 + Supabase 추적 (React island)
│   ├── radar/
│   │   └── IssueCard.astro      # 이슈 카드 컴포넌트
│   └── ui/
│       └── CtaButton.tsx        # 기본 CTA 버튼
│
├── content/
│   └── blog/
│       ├── qqq-etf-holdings.mdx       # 샘플 블로그 글
│       └── us-stock-rumor-check.mdx   # 샘플 블로그 글
│
├── data/
│   └── daily-issues.ts      # 이슈 레이더 데이터 (수동 관리)
│
├── lib/
│   ├── supabase.ts          # Supabase 클라이언트
│   └── analytics.ts         # CTA 클릭 추적 함수
│
└── config/
    ├── site.ts              # 사이트 메타데이터 설정
    └── links.ts             # 외부 링크 (앱스토어 등)

keystatic.config.ts          # Keystatic CMS 설정
wrangler.toml                # Cloudflare Workers 설정
astro.config.mjs             # Astro 설정
```

---

## 6. Astro SSR 모드 주의사항

이 프로젝트는 `output: "server"` (SSR 모드)를 사용합니다.
정적 페이지는 파일 상단에 **반드시** 아래 줄을 추가해야 합니다:

```astro
---
export const prerender = true;
---
```

없으면 Workers가 매 요청마다 SSR로 렌더링합니다 (비효율).
현재 모든 페이지에 적용되어 있음 ✅

---

## 7. Supabase 테이블 스키마

### `cta_events` (생성 완료 ✅)
```sql
CREATE TABLE cta_events (
  id bigserial PRIMARY KEY,
  event_type text NOT NULL,
  page text,
  cta_label text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE cta_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "insert only" ON cta_events FOR INSERT WITH CHECK (true);
```

### `comments` (⚠️ 아직 생성 안 됨 — 실행 필요)
```sql
CREATE TABLE comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_slug text NOT NULL,
  author_name text NOT NULL,
  content text NOT NULL,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Read approved only" ON comments FOR SELECT USING (is_approved = true);
```

Supabase 대시보드 → SQL Editor → 위 SQL 실행

---

## 8. Keystatic CMS

### 접근 URL
- 로컬: `http://localhost:4321/keystatic`
- 프로덕션: `https://stockping-landing.camoes666.workers.dev/keystatic`

### GitHub OAuth App
- Client ID: `0v23limRN6BNTSH7nbSm`
- 저장소: `camoes666/stockping-landing`
- 브랜치 프리픽스: `cms/` (CMS에서 글 저장 시 이 브랜치로 PR 생성)

### ⚠️ 해야 할 일: OAuth Callback URL 업데이트
GitHub → Settings → Developer settings → OAuth Apps → stockping-landing
```
Authorization callback URL:
https://stockping-landing.camoes666.workers.dev/keystatic/github/oauth/callback
```

### 블로그 글 스키마 (Content Collection)
```yaml
title: string (slug 자동 생성)
description: string (최대 180자, SEO용)
category: etf | news-rumor | analyst-report | insider-congress | stock-data
tags: string[]
publishedAt: date (YYYY-MM-DD)
updatedAt: date (YYYY-MM-DD)
thumbnail: image (public/blog-images/ 저장)
ctaType: etf | today | download | default
disclaimer: boolean (투자 면책 고지 표시 여부)
content: mdx
```

---

## 9. Cloudflare Workers 바인딩

자동 프로비저닝된 리소스:
- `SESSION` KV Namespace ID: `71ae2ad8a27f4187872f1cffead2debf` (Keystatic 세션용)
- `IMAGES` Cloudflare Images (이미지 최적화용)
- `ASSETS` Workers Static Assets (정적 파일 서빙)

> R2 버킷은 아직 미설정. Cloudflare 대시보드에서 R2를 활성화한 후
> `wrangler r2 bucket create stockping-images`로 생성 가능.

---

## 10. 블로그 카테고리

| value | label |
|-------|-------|
| `etf` | ETF |
| `news-rumor` | 뉴스/루머 |
| `analyst-report` | 애널리스트 |
| `insider-congress` | 내부자/의원 |
| `stock-data` | 종목데이터 |

블로그 URL 패턴: `/blog/[slug]`, `/blog/category/[category]`

---

## 11. 주요 설정값 변경 위치

| 변경할 것 | 파일 |
|-----------|------|
| 사이트명 ("회사명" 교체) | `src/config/site.ts` → `siteName` |
| 앱 메타 타이틀/설명 | `src/config/site.ts` |
| 앱스토어 링크 | `src/config/links.ts` → `playStore` |
| iOS 앱스토어 링크 추가 | `src/config/links.ts` → `appStore` 추가 |
| 이슈 레이더 데이터 | `src/data/daily-issues.ts` (매일 수동 업데이트) |
| 푸터 회사 정보 | `src/layouts/BaseLayout.astro` |

---

## 12. 알려진 이슈 및 주의사항

### 인코딩 주의 ⚠️
Windows 환경에서 한글 파일을 `sed`, `awk` 등 터미널 명령으로 편집하면
한글이 CP949로 깨질 수 있음. **반드시 Edit/Write 툴로만 파일 편집.**

현재 수정 완료된 파일:
- `src/pages/index.astro` ✅
- `src/pages/radar.astro` ✅
- `src/pages/blog/index.astro` ✅

### SSR + prerender 패턴
- `export const prerender = true` 중복 삽입 금지 (빌드 오류)
- 새 페이지 추가 시 프런트매터 첫 줄에 추가

### Keystatic 주의
- `keystatic.config.ts`의 `repo.owner`가 실제 GitHub 계정과 일치해야 함
- 로컬 개발 시 OAuth callback은 `http://localhost:4321/keystatic/github/oauth/callback`

---

## 13. 알려진 버그 및 패치 이력

### Keystatic + Astro v6 호환성 패치 (`src/middleware.ts`)
`@keystatic/astro` v5.0.6이 `Astro.locals.runtime.env`를 사용하는데
Astro v6에서 이 API가 제거됨 → `/api/keystatic/*` 요청 시 HTTP 500 발생.

**패치**: `src/middleware.ts`에서 `cloudflare:workers` 모듈로 실제 env를
가져와 `locals.runtime.env`에 다시 주입함. 최신 Keystatic 버전이 나오면
이 미들웨어 제거 가능.

### 한글 인코딩 손상 주의
Windows에서 `sed`/`awk` 터미널 명령으로 `.astro` 파일 수정 시 한글이
CP949로 깨짐. **반드시 Edit/Write 툴로만 파일 편집.**

---

## 14. GitHub Actions CI/CD

### 워크플로 파일
- `.github/workflows/deploy.yml` — `release/v0.1.0` push 시 자동 빌드+배포
- `.github/workflows/cms-merge.yml` — `cms/*` 브랜치 PR 자동 머지

### 필요한 GitHub Repository Secrets
**https://github.com/camoes666/stockping-landing/settings/secrets/actions**

| Secret 이름 | 값 |
|------------|-----|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token (Workers Scripts Edit 권한) |
| `CLOUDFLARE_ACCOUNT_ID` | `8b7068a3aae6ad3e59feaeb245787574` |
| `PUBLIC_SUPABASE_URL` | `https://jczdryhzgbyvxmughuth.supabase.co` |
| `PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable__fXC9RT_UShJKw_wnD8iig_f-Sr3bcH` |
| `KEYSTATIC_GITHUB_CLIENT_ID` | `0v23limRN6BNTSH7nbSm` |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | `cd89500272b3f75cd81a4e856be0543b3aef6a46` |
| `KEYSTATIC_SECRET` | `fe651fe768065c2c4c78d85f9bf13ddcdbac9f3ae9f31451ab6ef35d7acec753` |

### Cloudflare API Token 생성 방법
1. https://dash.cloudflare.com/profile/api-tokens → Create Token
2. Custom Token → 권한: **Account · Workers Scripts · Edit**, **Account · Workers KV Storage · Edit**
3. Account Resources: camoes666@gmail.com

---

## 15. 완료된 작업 목록

- [x] **2026-06-01: SEO 개선**
  - `siteName: "회사명"` → `"스톡핑"` 교체 (`src/config/site.ts`) — 블로그 타이틀, 헤더, 푸터 전체 반영
  - `defaultTitle`에 `| 스톡핑` 브랜드 추가
  - `defaultDescription` 키워드 최적화 (미국주식·뉴스·ETF·내부자 거래·한국어)
- [x] **2026-06-01: 블로그 내부 링크 추가** (이탈률 개선)
  - 마이크론 HBM 랠리 → SK vs 마이크론 HBM 비교 (양방향)
  - JEPI vs JEPQ → ETF 입문 가이드, SCHD 분석
  - ETF 입문 가이드 → JEPI vs JEPQ, SCHD 분석
- [x] **2026-06-01: 이슈 레이더 개편** (`src/pages/radar.astro`)
  - 날짜별 그룹핑 히스토리 뷰로 전환
  - 오늘 섹션에 "오늘" 뱃지 표시
  - 마지막 업데이트 시간 KST 표시
  - 이슈 표시 limit 10 → 100으로 확대
  - 3열 그리드 레이아웃
- [x] **2026-06-01: DailyIssue 타입에 `updatedAt` 필드 추가** (`src/data/daily-issues.ts`, `src/lib/supabase.ts`)
- [x] Astro 6 프로젝트 초기 세팅 (React, Tailwind, MDX, Sitemap)
- [x] 메인 랜딩 페이지 (Hero, Social Proof, Benefits, Issue Radar, How It Works, FAQ, CTA)
- [x] 이슈 레이더 페이지 (`/radar`)
- [x] 개인정보처리방침 / 이용약관 페이지
- [x] 블로그 시스템 (목록, 상세, 카테고리 필터)
- [x] 블로그 레이아웃 (BlogCard, PostMeta, DisclaimerBox, CTABox)
- [x] RSS 피드 (`/rss.xml`)
- [x] Sitemap
- [x] Supabase CTA 클릭 추적 (`cta_events`)
- [x] TrackedCtaButton React island
- [x] Keystatic CMS 연동 (GitHub 저장 모드)
- [x] Supabase 댓글 시스템 (CommentSection React island)
- [x] Cloudflare Workers 배포 (wrangler deploy)
- [x] 환경변수 Workers Secrets 등록
- [x] GitHub `release/v0.1.0` 브랜치 푸시
- [x] 한글 인코딩 손상 복구 (index.astro, radar.astro)
- [x] Keystatic 500 에러 수정 (middleware.ts shim)
- [x] GitHub Actions 자동 배포 워크플로

---

## 16. 남은 작업 (TODO)

- [ ] **GitHub Secrets 7개 등록** (섹션 14 표 참고) — Actions 자동 배포 활성화
- [ ] **GitHub OAuth Callback URL 추가** — `https://stockping-landing.camoes666.workers.dev/keystatic/github/oauth/callback`
- [x] **Supabase `comments` 테이블 생성** ✅ (확인 완료)
- [x] `src/config/site.ts`에서 `siteName: "회사명"` → `"스톡핑"` 교체 완료
- [ ] `src/config/links.ts`에서 iOS App Store 링크 추가 (출시 후)
- [ ] Cloudflare R2 활성화 → `stockping-images` 버킷 생성 → Keystatic 이미지 업로드 R2 연동
- [ ] 커스텀 도메인 연결 (Cloudflare Workers → Settings → Domains & Routes)
- [x] `src/data/daily-issues.ts` 이슈 레이더 자동 업데이트 파이썬 스크립트로 자동화 완료
- [ ] `master` 브랜치에 `release/v0.1.0` 머지

---

## 17. 빠른 명령어 참고

```bash
# 로컬 개발
npm run dev

# 빌드
npm run build

# 배포
npx wrangler deploy

# 환경변수 확인
npx wrangler secret list

# Workers 로그 (실시간)
npx wrangler tail

# 테스트
npm run test

# KV 네임스페이스 목록
npx wrangler kv namespace list
```
