# Blog Redesign Implementation Spec

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this spec.

**Goal:** Redesign the blog index and blog post detail pages using the blog_hub_v2 layout structure and the Intercom-inspired warm cream design system from `design_sample/design.md`.

**Design Reference Files:**
- `design_sample/design.md` — color palette, typography, spacing rules
- `design_sample/blog_hub_v2/code.html` — layout structure reference
- `design_sample/refined_article_detail/code.html` — article detail reference

---

## Design System (Tailwind tokens from `tailwind.config.cjs`)

| Token | Value | Use |
|-------|-------|-----|
| `bg-warm-bg` | `#fff8f6` | Page background |
| `bg-warm-surface` | `#fff1ec` | Card hover tint |
| `bg-warm-surface-high` | `#ffe2d9` | Category badge bg |
| `border-warm-border` | `#e5beb2` | Card / divider borders |
| `text-warm-text` | `#281812` | Primary headings & body |
| `text-warm-muted` | `#5c4037` | Secondary text |
| `text-warm-subtle` | `#7b7b78` | Dates, meta |
| `text-warm-primary` | `#a63500` | Accent (links, badges, CTA) |
| `bg-warm-primary` | `#a63500` | Active tab, CTA button bg |
| `text-warm-accent` | `#d04500` | Hover accent color |

- **Cards:** `bg-white border border-warm-border rounded-lg`
- **Buttons:** `rounded` (4px), hover: `scale(1.05)` transition
- **Font:** Pretendard Variable (already configured)

---

## Page 1: Blog Index (`src/pages/blog/index.astro`)

### Layout Structure

```
[Category Filter Tabs]
[Featured Article Hero — first post]
[Article Grid — remaining posts, 3-col]
[Empty state if no posts]
```

### Category Filter Tabs
- Horizontal scrollable row of pill/tab buttons
- Active state: Fin Orange background (`#ff5600`) white text
- Inactive: warm cream bg, `#dedbd6` border, `#7b7b78` text
- Hover: border becomes `#ff5600`, text becomes `#ff5600`
- Items: 전체 | ETF | 뉴스/루머 | 애널리스트 | 내부자/의원 | 종목데이터

### Featured Article Hero (first post only)
- Full-width section, `background: #faf9f6`, `border-bottom: 1px solid #dedbd6`
- Two-column layout: thumbnail left (60%) + content right (40%)
- Thumbnail: `aspect-[16/9]`, `border-radius: 8px`, `overflow: hidden`
- Content right side:
  - Small Fin Orange category badge (uppercase, `font-size: 11px`, `letter-spacing: 0.8px`)
  - Title: `font-size: 2.5rem` (`text-4xl`), `font-weight: 700`, `letter-spacing: -0.04em`, `line-height: 1.1`, color `#111111`
  - Description: `font-size: 1rem`, color `#7b7b78`, `line-height: 1.6`, max 3 lines (`line-clamp-3`)
  - Date: `font-size: 0.75rem`, color `#9c9fa5`
  - "읽기 →" link: `color: #111111`, `font-weight: 600`, hover: `color: #ff5600`
- Mobile (< 768px): stacked vertically, thumbnail on top

### Article Grid (remaining posts)
- CSS Grid: 3 columns on `lg`, 2 on `sm`, 1 on mobile
- Gap: `1.5rem`

### Article Card (`src/components/blog/BlogCard.astro`)
- `background: #ffffff`, `border: 1px solid #dedbd6`, `border-radius: 8px`, `overflow: hidden`
- Hover: `box-shadow: 0 4px 16px rgba(0,0,0,0.08)`, `transform: translateY(-2px)`, transition `200ms`
- Structure:
  1. Thumbnail: `aspect-[16/9]`, `object-fit: cover` (if present)
  2. Content padding: `1.25rem`
  3. Category badge: Fin Orange text, `#fff3ee` background, `font-size: 11px`, uppercase, `letter-spacing: 0.8px`, `border-radius: 4px`, `padding: 2px 8px`
  4. Title: `font-size: 1rem`, `font-weight: 700`, `letter-spacing: -0.02em`, `line-height: 1.3`, color `#111111`, `margin-top: 0.5rem`, `line-clamp-2`
  5. Description: `font-size: 0.875rem`, color `#7b7b78`, `line-height: 1.5`, `margin-top: 0.25rem`, `line-clamp-2`
  6. Date: `font-size: 0.75rem`, color `#9c9fa5`, `margin-top: 0.75rem`

### Page Header
- Padding top `3rem`, bottom `2rem`
- Title "미국주식 투자 정보": `font-size: 2rem`, `font-weight: 700`, `letter-spacing: -0.04em`, color `#111111`
- Subtitle: `font-size: 0.9375rem`, color `#7b7b78`

---

## Page 2: Blog Post Detail (`src/layouts/BlogPostLayout.astro`)

### Layout Structure

```
[Full-width Hero Image]
[Two-column body: Article (left, ~65%) | Sidebar (right, ~35%, sticky)]
[Related Posts — 3-col grid]
```

### Hero Image
- Full viewport width, `aspect-[21/9]` on desktop, `aspect-[16/9]` on mobile
- `object-fit: cover`, no border-radius (edge-to-edge)

### Article + Sidebar Wrapper
- `max-width: 1200px`, `margin: 0 auto`, `padding: 0 1.5rem`
- Two-column grid: `grid-template-columns: 1fr 340px`, `gap: 3rem`
- Mobile (< 1024px): single column, sidebar below article

### Article Column (left)
- `padding-top: 2.5rem`
- **Post meta**: category badge (Fin Orange, same as card) + date inline
- **Title**: `font-size: 2.25rem`, `font-weight: 700`, `letter-spacing: -0.04em`, `line-height: 1.15`, `margin-top: 0.75rem`
- **Description lead**: `font-size: 1.125rem`, color `#7b7b78`, `line-height: 1.7`, `margin: 1rem 0 1.5rem`
- **Divider**: `border-top: 1px solid #dedbd6`, `margin-bottom: 2rem`
- **Body prose**: standard Tailwind `prose`, customized:
  - `prose-headings:font-weight-700 prose-headings:tracking-tight`
  - `prose-a:text-[#ff5600]`
  - `prose-p:leading-7`
  - Line length `max-w-none` (constrained by column)
- **CTA box**: existing `<CTABox>` component, styled with Fin Orange border-left accent
- **Disclaimer**: existing `<DisclaimerBox>` component
- **Comments**: existing `<CommentSection>` component

### Sidebar Column (right)
- `position: sticky`, `top: 2rem`, `align-self: start`
- **App CTA Card**:
  - `background: #111111`, `border-radius: 12px`, `padding: 1.5rem`
  - Small Fin Orange label tag: "스톡핑 앱"
  - Heading: `color: white`, `font-size: 1.25rem`, `font-weight: 700`, `letter-spacing: -0.03em`
  - Subtext: `color: #9c9fa5`, `font-size: 0.875rem`
  - CTA button: `background: #ff5600`, `color: white`, `border-radius: 4px`, `padding: 0.625rem 1rem`, full width, hover `scale(1.02)`
- **Tags section** (below CTA card):
  - Label "태그", `font-size: 0.75rem`, uppercase, `letter-spacing: 0.8px`, color `#9c9fa5`
  - Tag pills: `background: #f0ede8`, `border-radius: 4px`, `font-size: 0.8125rem`, color `#111111`

### Related Posts Section
- `border-top: 1px solid #dedbd6`, `padding-top: 2.5rem`, `margin-top: 3rem`
- Section label: "관련 글", `font-size: 0.75rem`, uppercase, `letter-spacing: 1px`, color `#9c9fa5`
- 3-col grid of `<BlogCard>` (same component as index page)
- Fetch: 3 posts from same category, excluding current post; fall back to latest 3 if fewer than 3 in category

---

## Files to Change

| File | Action |
|------|--------|
| `src/pages/blog/index.astro` | Rewrite layout: header, featured hero, grid |
| `src/components/blog/BlogCard.astro` | Restyle card with new design tokens |
| `src/layouts/BlogPostLayout.astro` | Rewrite: two-column layout, sticky sidebar, related posts |
| `src/pages/blog/[slug].astro` | Pass `allPosts` prop for related posts |

---

## Tailwind Classes vs Inline Styles

The project uses Tailwind. Use Tailwind utility classes where possible. For values not in the default Tailwind scale (e.g., `#ff5600`, `#faf9f6`, `#dedbd6`, `#7b7b78`), use the existing custom Tailwind tokens defined in the project (e.g., `bg-warm-bg`, `text-warm-primary`, `border-warm-border`) — check `tailwind.config.cjs` to confirm exact token names before writing code.

---

## Out of Scope

- Category filter pages (`src/pages/blog/category/`) — no change
- CTA copy logic (`cta-copy.ts`) — no change
- Comment section React component — no change
- RSS feed — no change
