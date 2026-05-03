# Blog Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the blog index page and blog post detail layout to match the editorial warm-cream design from `design_sample/`, featuring a featured-article hero, 3-column card grid, and a two-column article+sidebar detail layout.

**Architecture:** Four files change: `BlogCard.astro` (restyled card component), `blog/index.astro` (featured hero + grid), `BlogPostLayout.astro` (two-column + related posts), `blog/[slug].astro` (passes `allPosts` prop). No logic changes — pure UI.

**Tech Stack:** Astro 6, Tailwind CSS (custom warm tokens in `tailwind.config.cjs`), Pretendard Variable font.

---

## Tailwind Token Reference (from `tailwind.config.cjs`)

```
bg-warm-bg          = #fff8f6   (page background)
bg-warm-surface     = #fff1ec   (light card tint)
bg-warm-surface-high = #ffe2d9  (category badge bg)
border-warm-border  = #e5beb2   (borders)
text-warm-text      = #281812   (primary text)
text-warm-muted     = #5c4037   (secondary text)
text-warm-subtle    = #7b7b78   (dates, meta)
text-warm-primary   = #a63500   (accent: links, badges)
bg-warm-primary     = #a63500   (active tab, CTA button)
bg-warm-accent      = #d04500   (hover accent)
```

---

## Task 1: Restyle BlogCard component

**Files:**
- Modify: `src/components/blog/BlogCard.astro`

- [ ] **Step 1: Replace BlogCard with restyled version**

Open `src/components/blog/BlogCard.astro` and replace the entire file content with:

```astro
---
interface Props {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  publishedAt: string;
  thumbnail?: string;
}

const { slug, title, description, category, tags, publishedAt, thumbnail } = Astro.props;

const categoryLabels: Record<string, string> = {
  etf: "ETF",
  "news-rumor": "뉴스/루머",
  "analyst-report": "애널리스트",
  "insider-congress": "내부자/의원",
  "stock-data": "종목데이터",
};

function formatKoreanDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${year}년 ${month}월 ${day}일`;
}

const categoryLabel = categoryLabels[category] ?? category;
---

<a
  href={`/blog/${slug}`}
  class="group bg-white border border-warm-border rounded-lg overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
>
  {thumbnail ? (
    <div class="aspect-[16/9] overflow-hidden bg-warm-surface">
      <img
        src={thumbnail}
        alt={title}
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        loading="lazy"
      />
    </div>
  ) : (
    <div class="aspect-[16/9] bg-warm-surface flex items-center justify-center">
      <span class="text-warm-border text-4xl font-bold tracking-tighter">
        {categoryLabel}
      </span>
    </div>
  )}
  <div class="p-5 flex flex-col flex-1">
    <span class="inline-block bg-warm-surface-high text-warm-primary text-[11px] font-bold uppercase tracking-widest rounded px-2 py-0.5 self-start">
      {categoryLabel}
    </span>
    <p class="text-warm-text font-bold text-base leading-snug tracking-tight mt-2.5 line-clamp-2">
      {title}
    </p>
    <p class="text-warm-subtle text-sm mt-1.5 line-clamp-2 leading-relaxed flex-1">
      {description}
    </p>
    <p class="text-warm-subtle text-xs mt-4 font-medium">
      {formatKoreanDate(publishedAt)}
    </p>
  </div>
</a>
```

- [ ] **Step 2: Verify existing tests still pass**

```bash
cd /path/to/datadnp-us-landing
npx vitest run src/pages/blog/_blog-pages.test.ts
```

Expected: all tests pass (tests don't touch BlogCard rendering).

- [ ] **Step 3: Commit**

```bash
git add src/components/blog/BlogCard.astro
git commit -m "redesign: restyle BlogCard with editorial warm design"
```

---

## Task 2: Redesign blog index page with featured hero

**Files:**
- Modify: `src/pages/blog/index.astro`

- [ ] **Step 1: Replace blog index with new layout**

Open `src/pages/blog/index.astro` and replace the entire file content with:

```astro
---
export const prerender = true;
import { getCollection } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
import BlogCard from "../../components/blog/BlogCard.astro";
import { siteConfig } from "../../config/site";

const posts = await getCollection("blog");
const sorted = posts.sort(
  (a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime()
);

const featured = sorted[0];
const rest = sorted.slice(1);

const categories = [
  { value: "etf", label: "ETF" },
  { value: "news-rumor", label: "뉴스/루머" },
  { value: "analyst-report", label: "애널리스트" },
  { value: "insider-congress", label: "내부자/의원" },
  { value: "stock-data", label: "종목데이터" },
];

const categoryLabels: Record<string, string> = {
  etf: "ETF",
  "news-rumor": "뉴스/루머",
  "analyst-report": "애널리스트",
  "insider-congress": "내부자/의원",
  "stock-data": "종목데이터",
};

function formatKoreanDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${year}년 ${month}월 ${day}일`;
}
---

<BaseLayout
  title={`미국주식 투자 정보 블로그 | ${siteConfig.siteName}`}
  description="미국주식 ETF, 뉴스/루머, 애널리스트 리포트, 내부자 거래 정보를 한국어로 정리합니다."
>
  <div class="bg-warm-bg min-h-screen">

    <!-- Page Header -->
    <div class="max-w-6xl mx-auto px-4 pt-12 pb-6">
      <h1 class="text-warm-text text-4xl font-bold tracking-tight leading-none mb-2">
        미국주식 투자 정보
      </h1>
      <p class="text-warm-muted text-base">ETF · 뉴스/루머 · 애널리스트 리포트 · 내부자 거래를 한국어로 정리합니다</p>
    </div>

    <!-- Category Filter Tabs -->
    <div class="max-w-6xl mx-auto px-4 pb-8">
      <nav class="flex flex-wrap gap-2">
        <a
          href="/blog"
          class="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded border bg-warm-primary border-warm-primary text-white transition-all duration-150"
        >
          전체
        </a>
        {categories.map((cat) => (
          <a
            href={`/blog/category/${cat.value}`}
            class="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded border border-warm-border text-warm-muted hover:border-warm-primary hover:text-warm-primary transition-all duration-150"
          >
            {cat.label}
          </a>
        ))}
      </nav>
    </div>

    <!-- Featured Article Hero (first post) -->
    {featured && (
      <div class="border-y border-warm-border bg-white mb-10">
        <div class="max-w-6xl mx-auto px-4 py-10">
          <a
            href={`/blog/${featured.id.replace(/\.[^.]+$/, "")}`}
            class="group grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          >
            <!-- Thumbnail -->
            <div class="aspect-[16/9] rounded-lg overflow-hidden bg-warm-surface order-1 md:order-2">
              {featured.data.thumbnail ? (
                <img
                  src={featured.data.thumbnail}
                  alt={featured.data.title}
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="eager"
                />
              ) : (
                <div class="w-full h-full flex items-center justify-center">
                  <span class="text-warm-border text-5xl font-bold tracking-tighter">
                    {categoryLabels[featured.data.category] ?? featured.data.category}
                  </span>
                </div>
              )}
            </div>

            <!-- Content -->
            <div class="order-2 md:order-1">
              <div class="flex items-center gap-3 mb-4">
                <span class="inline-block bg-warm-surface-high text-warm-primary text-[11px] font-bold uppercase tracking-widest rounded px-2 py-0.5">
                  {categoryLabels[featured.data.category] ?? featured.data.category}
                </span>
                <span class="text-warm-subtle text-xs font-medium">
                  {formatKoreanDate(featured.data.publishedAt)}
                </span>
              </div>
              <h2 class="text-warm-text text-3xl md:text-4xl font-bold tracking-tight leading-[1.1] mb-4 group-hover:text-warm-primary transition-colors duration-150">
                {featured.data.title}
              </h2>
              <p class="text-warm-muted text-base leading-relaxed line-clamp-3 mb-6">
                {featured.data.description}
              </p>
              <span class="inline-flex items-center gap-1 text-warm-text font-semibold text-sm group-hover:text-warm-primary transition-colors duration-150">
                읽기 →
              </span>
            </div>
          </a>
        </div>
      </div>
    )}

    <!-- Article Grid -->
    <div class="max-w-6xl mx-auto px-4 pb-16">
      {rest.length > 0 && (
        <>
          <h2 class="text-warm-text text-sm font-bold uppercase tracking-widest mb-6 text-warm-subtle">
            최신 글
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <BlogCard
                slug={post.id.replace(/\.[^.]+$/, "")}
                title={post.data.title}
                description={post.data.description}
                category={post.data.category}
                tags={post.data.tags}
                publishedAt={post.data.publishedAt}
                thumbnail={post.data.thumbnail}
              />
            ))}
          </div>
        </>
      )}

      {sorted.length === 0 && (
        <p class="text-warm-subtle text-center py-20 text-base">아직 게시물이 없습니다.</p>
      )}
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Build and visually verify**

```bash
npm run build 2>&1 | tail -20
```

Expected: Build completes with no errors. Check for TypeScript type errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "redesign: blog index with featured hero and editorial grid"
```

---

## Task 3: Redesign blog post detail layout

**Files:**
- Modify: `src/layouts/BlogPostLayout.astro`
- Modify: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Update [slug].astro to pass allPosts for related posts**

Open `src/pages/blog/[slug].astro` and replace with:

```astro
---
export const prerender = true;
import { getCollection, render } from "astro:content";
import BlogPostLayout from "../../layouts/BlogPostLayout.astro";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.id.replace(/\.[^.]+$/, "") },
    props: { post, allPosts: posts },
  }));
}

const { post, allPosts } = Astro.props;
const { Content } = await render(post);
---

<BlogPostLayout frontmatter={post.data} allPosts={allPosts} currentSlug={post.id.replace(/\.[^.]+$/, "")}>
  <Content />
</BlogPostLayout>
```

- [ ] **Step 2: Replace BlogPostLayout.astro with two-column redesign**

Open `src/layouts/BlogPostLayout.astro` and replace the entire file content with:

```astro
---
import BaseLayout from "./BaseLayout.astro";
import PostMeta from "../components/blog/PostMeta.astro";
import CTABox from "../components/blog/CTABox.astro";
import DisclaimerBox from "../components/blog/DisclaimerBox.astro";
import { CommentSection } from "../components/blog/CommentSection";
import BlogCard from "../components/blog/BlogCard.astro";
import type { CtaType } from "../components/blog/cta-copy";

interface Props {
  frontmatter: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    publishedAt: string;
    updatedAt: string;
    thumbnail?: string;
    ctaType: string;
    disclaimer: boolean;
  };
  allPosts?: any[];
  currentSlug?: string;
}

const { frontmatter, allPosts = [], currentSlug = "" } = Astro.props;
const {
  title,
  description,
  category,
  tags,
  publishedAt,
  updatedAt,
  thumbnail,
  ctaType,
  disclaimer,
} = frontmatter;

// Related posts: same category, excluding current, up to 3
const related = allPosts
  .filter(
    (p) =>
      p.id.replace(/\.[^.]+$/, "") !== currentSlug &&
      p.data.category === category
  )
  .sort(
    (a: any, b: any) =>
      new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime()
  )
  .slice(0, 3);

// Fallback: latest posts if not enough same-category
const fallback = allPosts
  .filter((p) => p.id.replace(/\.[^.]+$/, "") !== currentSlug)
  .sort(
    (a: any, b: any) =>
      new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime()
  )
  .slice(0, 3);

const relatedPosts = related.length >= 3 ? related : fallback;

const categoryLabels: Record<string, string> = {
  etf: "ETF",
  "news-rumor": "뉴스/루머",
  "analyst-report": "애널리스트",
  "insider-congress": "내부자/의원",
  "stock-data": "종목데이터",
};
const categoryLabel = categoryLabels[category] ?? category;
---

<BaseLayout title={title} description={description} ogImage={thumbnail}>
  <div class="bg-warm-bg min-h-screen">

    <!-- Hero Image -->
    {thumbnail && (
      <div class="w-full aspect-[21/9] overflow-hidden max-h-[480px]">
        <img
          src={thumbnail}
          alt={title}
          class="w-full h-full object-cover"
          loading="eager"
        />
      </div>
    )}

    <!-- Two-column body -->
    <div class="max-w-6xl mx-auto px-4 py-10">
      <div class="flex flex-col lg:flex-row gap-12">

        <!-- Article column -->
        <article class="flex-1 min-w-0">
          <!-- Meta: category badge + date (PostMeta renders category badge + tags + date internally) -->
          <PostMeta
            category={category}
            tags={tags}
            publishedAt={publishedAt}
            updatedAt={updatedAt}
          />

          <!-- Title -->
          <h1 class="text-warm-text text-3xl md:text-4xl font-bold tracking-tight leading-[1.1] mb-4">
            {title}
          </h1>

          <!-- Description lead -->
          <p class="text-warm-muted text-lg leading-relaxed mb-6">
            {description}
          </p>

          <hr class="border-warm-border mb-8" />

          <!-- Prose body -->
          <div
            class="
              prose max-w-none
              prose-headings:text-warm-text prose-headings:font-bold prose-headings:tracking-tight
              prose-p:leading-7 prose-p:text-warm-text
              prose-a:text-warm-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-warm-text
              prose-li:text-warm-text
              prose-hr:border-warm-border
              prose-blockquote:border-l-warm-primary prose-blockquote:text-warm-muted
            "
          >
            <slot />
          </div>

          <CTABox ctaType={ctaType as CtaType} />

          {disclaimer && <DisclaimerBox />}

          <CommentSection
            client:load
            postSlug={currentSlug || Astro.url.pathname.replace(/^\/blog\//, "").replace(/\/$/, "")}
          />
        </article>

        <!-- Sticky sidebar -->
        <aside class="w-full lg:w-72 xl:w-80 flex-shrink-0">
          <div class="sticky top-6 flex flex-col gap-6">

            <!-- App CTA card -->
            <div class="bg-warm-text rounded-xl p-6 relative overflow-hidden">
              <span class="inline-block text-warm-primary bg-warm-surface-high text-[10px] font-bold uppercase tracking-widest rounded px-2 py-0.5 mb-4">
                스톡핑 앱
              </span>
              <h3 class="text-white text-xl font-bold tracking-tight leading-tight mb-2">
                실시간 미국주식 정보를 앱에서 받아보세요
              </h3>
              <p class="text-warm-subtle text-sm leading-relaxed mb-5">
                ETF·내부자 거래·애널리스트 리포트를 한눈에
              </p>
              <a
                href="https://play.google.com/store/apps/details?id=kr.datadnp.app"
                target="_blank"
                rel="noopener noreferrer"
                class="block w-full bg-warm-primary text-white text-center text-sm font-bold py-2.5 rounded transition-transform duration-150 hover:scale-[1.02] hover:bg-warm-accent"
              >
                앱 다운로드
              </a>
            </div>

            <!-- Tags -->
            {tags.length > 0 && (
              <div>
                <p class="text-[11px] font-bold uppercase tracking-widest text-warm-subtle mb-3">태그</p>
                <div class="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span class="bg-warm-surface text-warm-text text-xs rounded px-2.5 py-1 font-medium border border-warm-border">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </aside>
      </div>

      <!-- Related posts -->
      {relatedPosts.length > 0 && (
        <div class="border-t border-warm-border mt-16 pt-10">
          <p class="text-[11px] font-bold uppercase tracking-widest text-warm-subtle mb-6">관련 글</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((p: any) => (
              <BlogCard
                slug={p.id.replace(/\.[^.]+$/, "")}
                title={p.data.title}
                description={p.data.description}
                category={p.data.category}
                tags={p.data.tags}
                publishedAt={p.data.publishedAt}
                thumbnail={p.data.thumbnail}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Build and check for errors**

```bash
npm run build 2>&1 | tail -30
```

Expected: Build completes with no TypeScript or Astro errors.

- [ ] **Step 4: Run all tests**

```bash
npx vitest run
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BlogPostLayout.astro src/pages/blog/\[slug\].astro
git commit -m "redesign: blog post detail with two-column layout, sticky sidebar, related posts"
```

---

## Task 4: Push and verify live

- [ ] **Step 1: Push to deploy branch**

```bash
git push
```

Expected: GitHub Actions triggers a deploy to Cloudflare Workers.

- [ ] **Step 2: Verify live blog index**

Visit `https://stockping-landing.camoes666.workers.dev/blog` and confirm:
- Page shows page header and category tabs
- First post appears as large featured hero (two-column layout)
- Remaining posts appear in 3-column card grid
- Cards have hover lift effect

- [ ] **Step 3: Verify live blog post detail**

Visit any blog post and confirm:
- Full-width hero image (if thumbnail exists)
- Two-column layout: article left, dark sidebar right
- Sidebar shows app CTA card and tags
- Related posts grid at bottom
- Responsive: sidebar moves below article on mobile

---

## Out of Scope

- Category filter pages (`src/pages/blog/category/`) — no change
- CTA copy logic (`cta-copy.ts`) — no change
- Comment section logic — no change
- RSS feed — no change
