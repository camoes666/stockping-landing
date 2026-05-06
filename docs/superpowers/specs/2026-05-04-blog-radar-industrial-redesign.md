# Blog + Issue Radar Industrial Precision Redesign

## Goal

Replace the warm coral palette on the blog index, blog post detail, blog category page, BlogCard component, and issue radar page with the "Industrial Precision" blue/slate/cyan design system — while leaving the landing page (`src/pages/index.astro`) and all landing page components untouched.

## Architecture

The redesign swaps CSS utility classes from `warm-*` tokens to Tailwind built-in `slate-*` and `cyan-*` classes, mirroring the reference HTML files in `stitch_us_stock_content_hub/`. No new Tailwind tokens are needed — the design uses standard Tailwind values. The IssueCard component gains status-badge mapping (emerald = confirmed, blue = market-view, amber = rumor) to match the market-radar-blue design. BlogCard gets a new slate/cyan industrial skin. The category page is restyled to match the new blog hub aesthetic.

## Tech Stack

- Astro v6, Tailwind CSS (existing config), Manrope (already in font stack via `Pretendard Variable` fallback chain)
- Reference designs: `stitch_us_stock_content_hub/blog_hub_blue/code.html`, `article_detail_blue/code.html`, `market_radar_blue/screen.png`
- No new npm dependencies

---

## Color Mapping (warm → industrial)

| Semantic role | Old warm token | New Tailwind class |
|---|---|---|
| Page background | `bg-warm-bg` | `bg-slate-50` |
| Card background | `bg-white` | `bg-white` |
| Dark section bg | — | `bg-slate-950` / `bg-slate-900` |
| Primary brand bg | `bg-warm-text` (dark) | `bg-slate-900` |
| Primary action | `text-warm-primary` / `bg-warm-primary` | `text-cyan-600` / `bg-cyan-600` |
| Border | `border-warm-border` | `border-slate-200` |
| Heading text | `text-warm-text` | `text-slate-900` |
| Body text | `text-warm-muted` | `text-slate-600` |
| Subtle/meta text | `text-warm-subtle` | `text-slate-500` |
| Category badge bg | `bg-warm-surface-high` | category-specific (see below) |
| Tag chips | `bg-warm-surface` | `bg-slate-100` |

## Status Badge Mapping (IssueCategory → color)

| `IssueCategory` | Badge classes |
|---|---|
| `"확인된 사실"` | `bg-emerald-100 text-emerald-700` |
| `"시장 관측"` | `bg-blue-100 text-blue-700` |
| `"루머"` | `bg-amber-100 text-amber-700` |

## Blog Post Category → Badge Mapping

| category | Badge classes |
|---|---|
| `etf` | `bg-blue-100 text-blue-700` |
| `news-rumor` | `bg-amber-100 text-amber-700` |
| `analyst-report` | `bg-emerald-100 text-emerald-700` |
| `insider-congress` | `bg-purple-100 text-purple-700` |
| `stock-data` | `bg-slate-100 text-slate-700` |

---

## Component Designs

### 1. BlogCard (`src/components/blog/BlogCard.astro`)

- White bg, `border border-slate-200`, `rounded-lg`, `shadow-sm`, hover: `-translate-y-1 shadow-md`
- Thumbnail 16:9 with `group-hover:scale-[1.04]` zoom
- Fallback no-image: `bg-slate-100` with category label in `text-slate-400`
- Category badge: status-based colors from mapping table above
- Title: `text-slate-900 font-bold text-base leading-snug` with `group-hover:text-cyan-600`
- Description: `text-slate-500 text-sm line-clamp-2`
- Date: `text-slate-400 text-xs`
- Focus ring: `focus-visible:ring-cyan-600`

### 2. Blog Index (`src/pages/blog/index.astro`)

**Structure (top to bottom):**

1. **Dark Hero header** (`bg-slate-900` text-white)
   - Label chip: `bg-cyan-600/20 text-cyan-400 text-[11px] uppercase tracking-widest` → "Intelligence Hub"
   - H1: `text-white text-4xl md:text-5xl font-bold` → "미국주식 투자 정보"
   - Sub: `text-slate-400` → same description as now
   - Stats row (hardcoded): "실시간 이슈 • 애널리스트 리포트 • 내부자 거래 • ETF 흐름"

2. **Category filter tabs** (`bg-white border-b border-slate-200`)
   - Active: `bg-slate-900 text-white` pill
   - Inactive: `text-slate-500 hover:text-slate-900`
   - Tabs for 전체 + each category

3. **Featured Analysis** (`bg-white border-b border-slate-200`)
   - "Featured Analysis" label + 2-col grid (text left, image right)
   - Status badge based on category
   - Title `text-slate-900 text-3xl font-bold group-hover:text-cyan-600`
   - "분석 읽기 →" CTA

4. **Latest Intelligence grid** (`bg-slate-50`)
   - Section label: `text-slate-500 text-xs uppercase tracking-widest` → "Latest Intelligence"
   - 3-col BlogCard grid

### 3. Blog Post Detail (`src/layouts/BlogPostLayout.astro`)

**Structure:**

1. **Breadcrumb header** (`bg-slate-50 border-b border-slate-200`)
   - `블로그 › {categoryLabel} › {title truncated}`
   - Status badge for category

2. **Two-column body** (`bg-white`)
   - Left: **Sticky TOC sidebar** (w-64) — "Table of Contents" heading, JS-generated TOC from `h2`/`h3` headings, with active state highlight in `text-cyan-600`. Below TOC: App CTA card (`bg-slate-900` dark card matching blog_hub_blue style)
   - Right: **Article** (flex-1 max-w-[800px])
     - Title `text-slate-900 text-3xl md:text-4xl font-bold`
     - Meta: category badge + date + tags row
     - `<hr class="border-slate-200">`
     - Prose body: `prose-blockquote:border-l-cyan-600 prose-a:text-cyan-600`
     - CTABox + DisclaimerBox
     - CommentSection

3. **Tags** moved inline under article (no sidebar tags)

4. **Related posts** (`bg-slate-50`) — same 3-col grid of BlogCards

### 4. Blog Category Page (`src/pages/blog/category/[category].astro`)

- Same header approach as blog index (dark hero, category filter nav)
- Same BlogCard grid
- No featured hero (just grid)
- Uses `CATEGORY_LABELS` from `blog-constants.ts` (fix DRY issue: remove local `categoryLabels` and import from constants)

### 5. Issue Radar Page (`src/pages/radar.astro`)

**Structure:**

1. **Dark Hero** (`bg-slate-900`)
   - Label chip: `bg-cyan-600/20 text-cyan-400` → "Market Intelligence Radar"
   - H1 `text-white` → same `siteConfig.radarPageTitle`
   - Sub `text-slate-400`
   - CTA button: `bg-cyan-600 hover:bg-cyan-700 text-white`

2. **Issue list** (`bg-slate-50`)
   - Issues mapped to `IssueCard` (restyled)

3. **Disclaimer** — same content, restyled: `border-amber-200 bg-amber-50 text-amber-800`

### 6. IssueCard (`src/components/radar/IssueCard.astro`)

- White bg, `border border-slate-200`, `rounded-lg shadow-sm`, `p-6`
- Status badge (emerald/blue/amber) from `issue.category` mapping
- Related symbols: `bg-slate-100 text-slate-600` chips
- Section labels (`확인된 사실`, `시장 관측`, `투자자가 볼 포인트`) as `text-slate-900 font-semibold text-sm`
- Body text: `text-slate-600 text-sm leading-6`
- Watch points: `list-disc list-inside space-y-1 text-slate-600`
- App data points: `bg-slate-100 text-slate-600` rounded chips
- CTA button: `bg-cyan-600 hover:bg-cyan-700 text-white` (replaces default CtaButton if possible, or keep CtaButton with href override)

---

## What Stays Unchanged

- `src/pages/index.astro` and all landing page components
- `tailwind.config.cjs` warm tokens (still used by landing page)
- `src/lib/blog-constants.ts` (shared, used by both old and new)
- `src/components/blog/PostMeta.astro` — restyled inline
- `src/components/blog/CTABox.astro`, `DisclaimerBox.astro` — minor re-skin only
- `BaseLayout.astro`, `siteConfig`, `links` — untouched

---

## TOC Sidebar JavaScript

The sticky TOC sidebar in BlogPostLayout needs a small inline `<script>` to:
1. Query all `h2` and `h3` elements inside the article
2. Build `<li>` items and insert into a `#toc-list` element
3. Use `IntersectionObserver` to highlight the active heading in `text-cyan-600`

This is a progressive enhancement — if no headings, the TOC is hidden.

---

## Files Changed

| File | Change |
|---|---|
| `src/components/blog/BlogCard.astro` | Full re-skin to industrial palette |
| `src/pages/blog/index.astro` | Full re-skin with dark hero + industrial layout |
| `src/layouts/BlogPostLayout.astro` | Full re-skin with TOC sidebar |
| `src/pages/blog/[slug].astro` | Minor: remove warm-bg wrapper if any |
| `src/pages/blog/category/[category].astro` | Re-skin + fix DRY (import from blog-constants) |
| `src/pages/radar.astro` | Full re-skin with dark hero |
| `src/components/radar/IssueCard.astro` | Full re-skin with status badges |
| `src/components/blog/PostMeta.astro` | Re-skin to slate palette |
| `src/components/blog/CTABox.astro` | Re-skin to cyan/slate CTA |
| `src/components/blog/DisclaimerBox.astro` | Minor re-skin |
