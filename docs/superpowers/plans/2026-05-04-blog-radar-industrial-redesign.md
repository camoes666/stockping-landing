# Blog + Issue Radar Industrial Precision Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin blog index, blog post detail, blog category page, BlogCard, issue radar page, and IssueCard from the warm coral palette to the "Industrial Precision" navy/slate/cyan design — without touching the landing page.

**Architecture:** Pure CSS class swaps from `warm-*` tokens to standard Tailwind `slate-*`/`cyan-*` classes. No new npm dependencies. The `tailwind.config.cjs` warm tokens stay intact (landing page still uses them). All components reference Tailwind built-in values.

**Tech Stack:** Astro v6, Tailwind CSS (existing config), Manrope already in font stack

---

## Color Reference (use throughout all tasks)

| Role | Class |
|---|---|
| Page bg | `bg-slate-50` |
| Card bg | `bg-white` |
| Dark section | `bg-slate-900` / `bg-slate-950` |
| Primary action | `bg-cyan-600` / `text-cyan-600` / `hover:bg-cyan-700` |
| Border | `border-slate-200` |
| Heading text | `text-slate-900` |
| Body text | `text-slate-600` |
| Meta/subtle text | `text-slate-500` |
| Tags/chips | `bg-slate-100 text-slate-600` |

**Status badges:**
- Confirmed (`확인된 사실` / `analyst-report`) → `bg-emerald-100 text-emerald-700`
- Market view (`시장 관측` / `etf`) → `bg-blue-100 text-blue-700`
- Rumor (`루머` / `news-rumor`) → `bg-amber-100 text-amber-700`
- Insider (`insider-congress`) → `bg-purple-100 text-purple-700`
- Data (`stock-data`) → `bg-slate-100 text-slate-700`

---

### Task 1: Re-skin shared small components (PostMeta, CTABox, DisclaimerBox)

**Files:**
- Modify: `src/components/blog/PostMeta.astro`
- Modify: `src/components/blog/CTABox.astro`
- Modify: `src/components/blog/DisclaimerBox.astro`

- [ ] **Step 1: Read current PostMeta.astro** (already read — shown below for reference)

  Current `src/components/blog/PostMeta.astro`:
  ```astro
  ---
  interface Props {
    category: string;
    tags: string[];
    publishedAt: string;
    updatedAt?: string;
  }
  const { category, tags, publishedAt, updatedAt } = Astro.props;
  const categoryLabels: Record<string, string> = { etf: "ETF", "news-rumor": "뉴스/루머", "analyst-report": "애널리스트", "insider-congress": "내부자/의원", "stock-data": "종목데이터" };
  function formatKoreanDate(dateStr: string): string { const [year, month, day] = dateStr.split("-"); return `${year}년 ${month}월 ${day}일`; }
  const categoryLabel = categoryLabels[category] ?? category;
  const showUpdated = updatedAt && updatedAt !== publishedAt;
  ---
  ```

- [ ] **Step 2: Rewrite PostMeta.astro** — import from blog-constants, swap warm → slate/cyan:

  Write `src/components/blog/PostMeta.astro`:
  ```astro
  ---
  import { CATEGORY_LABELS, formatKoreanDate } from "../../lib/blog-constants";

  interface Props {
    category: string;
    tags: string[];
    publishedAt: string;
    updatedAt?: string;
  }

  const { category, tags, publishedAt, updatedAt } = Astro.props;

  const CATEGORY_BADGE: Record<string, string> = {
    etf: "bg-blue-100 text-blue-700",
    "news-rumor": "bg-amber-100 text-amber-700",
    "analyst-report": "bg-emerald-100 text-emerald-700",
    "insider-congress": "bg-purple-100 text-purple-700",
    "stock-data": "bg-slate-100 text-slate-700",
  };

  const categoryLabel = CATEGORY_LABELS[category] ?? category;
  const badgeClass = CATEGORY_BADGE[category] ?? "bg-slate-100 text-slate-700";
  const showUpdated = updatedAt && updatedAt !== publishedAt;
  ---

  <div class="flex flex-wrap items-center gap-2 mb-4">
    <span class={`text-xs font-bold uppercase tracking-wide rounded px-2 py-1 ${badgeClass}`}>
      {categoryLabel}
    </span>
    {tags.map((tag) => (
      <span class="text-slate-600 text-xs border border-slate-200 rounded px-2 py-0.5">
        {tag}
      </span>
    ))}
    <span class="text-slate-500 text-xs ml-auto">
      {formatKoreanDate(publishedAt)}
      {showUpdated && (
        <span class="ml-2">수정: {formatKoreanDate(updatedAt!)}</span>
      )}
    </span>
  </div>
  ```

- [ ] **Step 3: Rewrite CTABox.astro** — swap warm bg/border/text to slate/cyan:

  Write `src/components/blog/CTABox.astro`:
  ```astro
  ---
  import { ctaCopy, type CtaType } from "./cta-copy";
  import { TrackedCtaButton } from "../islands/TrackedCtaButton";

  interface Props {
    ctaType: CtaType;
    page?: string;
  }

  const { ctaType, page = "blog" } = Astro.props;
  const copy = ctaCopy[ctaType];
  const playStoreUrl = "https://play.google.com/store/apps/details?id=kr.datadnp.app";
  ---

  <div class="bg-slate-50 border border-slate-200 rounded-xl p-6 my-8">
    <p class="text-cyan-600 text-xs font-bold uppercase tracking-wider mb-2">앱에서 더 보기</p>
    <p class="text-slate-900 font-bold text-lg mb-4">{copy.headline}</p>
    <TrackedCtaButton
      client:load
      href={playStoreUrl}
      label={copy.button}
      page={page}
      section={`cta-box:${ctaType}`}
      variant="primary"
    />
  </div>
  ```

- [ ] **Step 4: Rewrite DisclaimerBox.astro** — swap warm → slate:

  Write `src/components/blog/DisclaimerBox.astro`:
  ```astro
  ---
  ---

  <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-8">
    <p class="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">투자 유의사항</p>
    <p class="text-slate-500 text-xs leading-relaxed">
      본 글은 투자 판단을 돕기 위한 정보 제공 목적이며, 특정 종목의 매수·매도를 추천하지 않습니다. 투자에 관한 최종 결정과 책임은 투자자 본인에게 있습니다.
    </p>
  </div>
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/blog/PostMeta.astro src/components/blog/CTABox.astro src/components/blog/DisclaimerBox.astro
  git commit -m "style: re-skin blog shared components to industrial palette"
  ```

---

### Task 2: Re-skin BlogCard component

**Files:**
- Modify: `src/components/blog/BlogCard.astro`

- [ ] **Step 1: Write new BlogCard.astro** — industrial slate/cyan skin with status badge:

  Write `src/components/blog/BlogCard.astro`:
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

  import { CATEGORY_LABELS, formatKoreanDate } from "../../lib/blog-constants";

  const { slug, title, description, category, tags, publishedAt, thumbnail } = Astro.props;

  const categoryLabel = CATEGORY_LABELS[category] ?? category;

  const CATEGORY_BADGE: Record<string, string> = {
    etf: "bg-blue-100 text-blue-700",
    "news-rumor": "bg-amber-100 text-amber-700",
    "analyst-report": "bg-emerald-100 text-emerald-700",
    "insider-congress": "bg-purple-100 text-purple-700",
    "stock-data": "bg-slate-100 text-slate-700",
  };
  const badgeClass = CATEGORY_BADGE[category] ?? "bg-slate-100 text-slate-700";
  ---

  <a
    href={`/blog/${slug}`}
    class="group bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2"
  >
    {thumbnail ? (
      <div class="aspect-[16/9] overflow-hidden bg-slate-100">
        <img
          src={thumbnail}
          alt={title}
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          loading="lazy"
        />
      </div>
    ) : (
      <div class="aspect-[16/9] bg-slate-100 flex items-center justify-center">
        <span class="text-slate-400 text-4xl font-bold tracking-tighter">
          {categoryLabel}
        </span>
      </div>
    )}
    <div class="p-5 flex flex-col flex-1">
      <span class={`inline-block text-[11px] font-bold uppercase tracking-widest rounded px-2 py-0.5 self-start ${badgeClass}`}>
        {categoryLabel}
      </span>
      <p class="text-slate-900 font-bold text-base leading-snug tracking-tight mt-2.5 line-clamp-2 group-hover:text-cyan-600 transition-colors duration-150">
        {title}
      </p>
      <p class="text-slate-500 text-sm mt-1.5 line-clamp-2 leading-relaxed flex-1">
        {description}
      </p>
      <p class="text-slate-400 text-xs mt-4 font-medium">
        {formatKoreanDate(publishedAt)}
      </p>
    </div>
  </a>
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/components/blog/BlogCard.astro
  git commit -m "style: re-skin BlogCard to industrial palette"
  ```

---

### Task 3: Re-skin Blog Index page

**Files:**
- Modify: `src/pages/blog/index.astro`

- [ ] **Step 1: Write new blog index** — dark hero + cyan tabs + featured + 3-col grid:

  Write `src/pages/blog/index.astro`:
  ```astro
  ---
  export const prerender = true;
  import { getCollection } from "astro:content";
  import BaseLayout from "../../layouts/BaseLayout.astro";
  import BlogCard from "../../components/blog/BlogCard.astro";
  import { siteConfig } from "../../config/site";
  import { CATEGORY_LABELS, CATEGORY_OPTIONS, formatKoreanDate } from "../../lib/blog-constants";

  const posts = await getCollection("blog");
  const sorted = posts.sort(
    (a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime()
  );

  const featured = sorted[0];
  const rest = sorted.slice(1);

  const CATEGORY_BADGE: Record<string, string> = {
    etf: "bg-blue-100 text-blue-700",
    "news-rumor": "bg-amber-100 text-amber-700",
    "analyst-report": "bg-emerald-100 text-emerald-700",
    "insider-congress": "bg-purple-100 text-purple-700",
    "stock-data": "bg-slate-100 text-slate-700",
  };
  ---

  <BaseLayout
    title={`미국주식 투자 정보 블로그 | ${siteConfig.siteName}`}
    description="미국주식 ETF, 뉴스/루머, 애널리스트 리포트, 내부자 거래 정보를 한국어로 정리합니다."
  >
    <div class="min-h-screen bg-slate-50">

      <!-- Dark Hero -->
      <div class="bg-slate-900">
        <div class="max-w-6xl mx-auto px-4 py-14">
          <span class="inline-block bg-cyan-600/20 text-cyan-400 text-[11px] font-bold uppercase tracking-widest rounded px-3 py-1 mb-4">
            Intelligence Hub
          </span>
          <h1 class="text-white text-4xl md:text-5xl font-bold tracking-tight leading-none mb-3">
            미국주식 투자 정보
          </h1>
          <p class="text-slate-400 text-base max-w-xl">
            ETF · 뉴스/루머 · 애널리스트 리포트 · 내부자 거래를 한국어로 정리합니다
          </p>
        </div>
      </div>

      <!-- Category Filter Tabs -->
      <div class="bg-white border-b border-slate-200">
        <div class="max-w-6xl mx-auto px-4">
          <nav class="flex flex-wrap gap-1 py-3">
            <a
              href="/blog"
              class="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded bg-slate-900 text-white transition-all duration-150"
            >
              전체
            </a>
            {CATEGORY_OPTIONS.map((cat) => (
              <a
                href={`/blog/category/${cat.value}`}
                class="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all duration-150"
              >
                {cat.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <!-- Featured Analysis -->
      {featured && (
        <div class="bg-white border-b border-slate-200">
          <div class="max-w-6xl mx-auto px-4 py-10">
            <p class="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Featured Analysis</p>
            <a
              href={`/blog/${featured.id.replace(/\.[^.]+$/, "")}`}
              class="group grid grid-cols-1 md:grid-cols-2 gap-8 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2 rounded"
            >
              <!-- Thumbnail -->
              <div class="aspect-[16/9] rounded-lg overflow-hidden bg-slate-100 order-1 md:order-2">
                {featured.data.thumbnail ? (
                  <img
                    src={featured.data.thumbnail}
                    alt={featured.data.title}
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="eager"
                  />
                ) : (
                  <div class="w-full h-full flex items-center justify-center">
                    <span class="text-slate-400 text-5xl font-bold tracking-tighter">
                      {CATEGORY_LABELS[featured.data.category] ?? featured.data.category}
                    </span>
                  </div>
                )}
              </div>
              <!-- Content -->
              <div class="order-2 md:order-1">
                <div class="flex items-center gap-3 mb-4">
                  <span class={`inline-block text-[11px] font-bold uppercase tracking-widest rounded px-2 py-0.5 ${CATEGORY_BADGE[featured.data.category] ?? "bg-slate-100 text-slate-700"}`}>
                    {CATEGORY_LABELS[featured.data.category] ?? featured.data.category}
                  </span>
                  <span class="text-slate-500 text-xs font-medium">
                    {formatKoreanDate(featured.data.publishedAt)}
                  </span>
                </div>
                <h2 class="text-slate-900 text-3xl md:text-4xl font-bold tracking-tight leading-[1.1] mb-4 group-hover:text-cyan-600 transition-colors duration-150">
                  {featured.data.title}
                </h2>
                <p class="text-slate-600 text-base leading-relaxed line-clamp-3 mb-6">
                  {featured.data.description}
                </p>
                <span class="inline-flex items-center gap-1 text-slate-900 font-semibold text-sm group-hover:text-cyan-600 transition-colors duration-150">
                  분석 읽기 →
                </span>
              </div>
            </a>
          </div>
        </div>
      )}

      <!-- Latest Intelligence grid -->
      <div class="max-w-6xl mx-auto px-4 py-12">
        {rest.length > 0 && (
          <>
            <p class="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">
              Latest Intelligence
            </p>
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
          <p class="text-slate-500 text-center py-20 text-base">아직 게시물이 없습니다.</p>
        )}
      </div>

    </div>
  </BaseLayout>
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/pages/blog/index.astro
  git commit -m "style: re-skin blog index to industrial precision design"
  ```

---

### Task 4: Re-skin Blog Post Layout (with TOC sidebar)

**Files:**
- Modify: `src/layouts/BlogPostLayout.astro`

- [ ] **Step 1: Write new BlogPostLayout.astro** — slate header, left TOC sidebar, cyan prose:

  Write `src/layouts/BlogPostLayout.astro`:
  ```astro
  ---
  import BaseLayout from "./BaseLayout.astro";
  import PostMeta from "../components/blog/PostMeta.astro";
  import CTABox from "../components/blog/CTABox.astro";
  import DisclaimerBox from "../components/blog/DisclaimerBox.astro";
  import { CommentSection } from "../components/blog/CommentSection";
  import BlogCard from "../components/blog/BlogCard.astro";
  import type { CtaType } from "../components/blog/cta-copy";
  import type { CollectionEntry } from "astro:content";
  import { CATEGORY_LABELS } from "../lib/blog-constants";

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
    allPosts?: CollectionEntry<"blog">[];
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

  const sameCategoryPosts = allPosts
    .filter(
      (p: CollectionEntry<"blog">) =>
        p.id.replace(/\.[^.]+$/, "") !== currentSlug &&
        p.data.category === category
    )
    .sort(
      (a: CollectionEntry<"blog">, b: CollectionEntry<"blog">) =>
        new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime()
    );

  const otherPosts = allPosts
    .filter(
      (p: CollectionEntry<"blog">) =>
        p.id.replace(/\.[^.]+$/, "") !== currentSlug &&
        p.data.category !== category
    )
    .sort(
      (a: CollectionEntry<"blog">, b: CollectionEntry<"blog">) =>
        new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime()
    );

  const relatedPosts = [...sameCategoryPosts, ...otherPosts].slice(0, 3);

  const CATEGORY_BADGE: Record<string, string> = {
    etf: "bg-blue-100 text-blue-700",
    "news-rumor": "bg-amber-100 text-amber-700",
    "analyst-report": "bg-emerald-100 text-emerald-700",
    "insider-congress": "bg-purple-100 text-purple-700",
    "stock-data": "bg-slate-100 text-slate-700",
  };
  const badgeClass = CATEGORY_BADGE[category] ?? "bg-slate-100 text-slate-700";
  const categoryLabel = CATEGORY_LABELS[category] ?? category;
  ---

  <BaseLayout title={title} description={description} ogImage={thumbnail}>
    <div class="min-h-screen bg-white">

      <!-- Breadcrumb header -->
      <div class="bg-slate-50 border-b border-slate-200">
        <div class="max-w-6xl mx-auto px-4 py-4">
          <nav class="flex items-center gap-2 text-xs text-slate-500">
            <a href="/blog" class="hover:text-cyan-600 transition-colors">블로그</a>
            <span>›</span>
            <a href={`/blog/category/${category}`} class="hover:text-cyan-600 transition-colors">
              {categoryLabel}
            </a>
            <span>›</span>
            <span class="text-slate-700 line-clamp-1 max-w-[300px]">{title}</span>
          </nav>
        </div>
      </div>

      <!-- Hero Image -->
      {thumbnail && (
        <div class="w-full overflow-hidden max-h-[400px]" style="aspect-ratio: 21/9;">
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

          <!-- Left sticky sidebar (TOC + App CTA) -->
          <aside class="hidden lg:block w-56 xl:w-64 flex-shrink-0">
            <div class="sticky top-6 flex flex-col gap-6">

              <!-- TOC -->
              <div id="toc-container">
                <p class="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                  Table of Contents
                </p>
                <nav id="toc-nav">
                  <ol id="toc-list" class="space-y-1 text-sm text-slate-500"></ol>
                </nav>
              </div>

              <!-- App CTA card -->
              <div class="bg-slate-900 rounded-lg p-5 relative overflow-hidden">
                <span class="inline-block bg-cyan-600/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest rounded px-2 py-0.5 mb-3">
                  스톡핑 앱
                </span>
                <h3 class="text-white text-base font-bold tracking-tight leading-tight mb-2">
                  실시간 미국주식 정보를 앱에서 받아보세요
                </h3>
                <p class="text-slate-400 text-xs leading-relaxed mb-4">
                  ETF · 내부자 거래 · 애널리스트 리포트
                </p>
                <a
                  href="https://play.google.com/store/apps/details?id=kr.datadnp.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block w-full bg-cyan-600 text-white text-center text-xs font-bold py-2.5 rounded transition-all duration-150 hover:bg-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2"
                >
                  앱 다운로드
                </a>
              </div>

            </div>
          </aside>

          <!-- Article column -->
          <article class="flex-1 min-w-0 max-w-[800px]">
            <!-- Status badge + date -->
            <div class="flex items-center gap-3 mb-3">
              <span class={`text-[11px] font-bold uppercase tracking-widest rounded px-2 py-0.5 ${badgeClass}`}>
                {categoryLabel}
              </span>
            </div>

            <!-- Title -->
            <h1 class="text-slate-900 text-3xl md:text-4xl font-bold tracking-tight leading-[1.1] mb-3">
              {title}
            </h1>

            <!-- Meta row -->
            <PostMeta
              category={category}
              tags={tags}
              publishedAt={publishedAt}
              updatedAt={updatedAt}
            />

            <!-- Description lead -->
            <p class="text-slate-600 text-lg leading-relaxed mb-6">
              {description}
            </p>

            <hr class="border-slate-200 mb-8" />

            <!-- Prose body -->
            <div
              class="
                prose max-w-none
                prose-headings:text-slate-900 prose-headings:font-bold prose-headings:tracking-tight
                prose-p:leading-7 prose-p:text-slate-700
                prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-slate-900
                prose-li:text-slate-700
                prose-hr:border-slate-200
                prose-blockquote:border-l-cyan-600 prose-blockquote:text-slate-500
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

        </div>

        <!-- Related posts -->
        {relatedPosts.length > 0 && (
          <div class="border-t border-slate-200 mt-16 pt-10 bg-slate-50 -mx-4 px-4 pb-10 rounded-lg">
            <p class="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-6">관련 글</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((p: CollectionEntry<"blog">) => (
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

    <!-- TOC JS: build from article headings, highlight active -->
    <script>
      const tocList = document.getElementById("toc-list");
      const tocContainer = document.getElementById("toc-container");
      if (tocList && tocContainer) {
        const article = document.querySelector("article");
        const headings = article ? Array.from(article.querySelectorAll("h2, h3")) : [];

        if (headings.length === 0) {
          tocContainer.style.display = "none";
        } else {
          headings.forEach((heading, i) => {
            if (!heading.id) heading.id = `heading-${i}`;
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = `#${heading.id}`;
            a.textContent = heading.textContent ?? "";
            a.className =
              heading.tagName === "H3"
                ? "block pl-3 py-0.5 text-xs text-slate-400 hover:text-cyan-600 transition-colors border-l border-slate-200"
                : "block py-0.5 text-slate-500 hover:text-cyan-600 transition-colors font-medium";
            li.appendChild(a);
            tocList.appendChild(li);
          });

          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                const id = entry.target.id;
                const link = tocList.querySelector(`a[href="#${id}"]`) as HTMLAnchorElement | null;
                if (!link) return;
                if (entry.isIntersecting) {
                  tocList.querySelectorAll("a").forEach((a) => a.classList.remove("text-cyan-600", "font-bold"));
                  link.classList.add("text-cyan-600", "font-bold");
                }
              });
            },
            { rootMargin: "0px 0px -60% 0px" }
          );

          headings.forEach((h) => observer.observe(h));
        }
      }
    </script>
  </BaseLayout>
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/layouts/BlogPostLayout.astro
  git commit -m "style: re-skin blog post layout with TOC sidebar and industrial palette"
  ```

---

### Task 5: Re-skin Blog Category page

**Files:**
- Modify: `src/pages/blog/category/[category].astro`

- [ ] **Step 1: Write new category page** — dark hero + cyan tabs + card grid, fix DRY (import from blog-constants):

  Write `src/pages/blog/category/[category].astro`:
  ```astro
  ---
  export const prerender = true;
  import { getCollection } from "astro:content";
  import BaseLayout from "../../../layouts/BaseLayout.astro";
  import BlogCard from "../../../components/blog/BlogCard.astro";
  import { siteConfig } from "../../../config/site";
  import { CATEGORY_LABELS, CATEGORY_OPTIONS } from "../../../lib/blog-constants";

  const VALID_CATEGORIES = ["etf", "news-rumor", "analyst-report", "insider-congress", "stock-data"] as const;
  type ValidCategory = typeof VALID_CATEGORIES[number];

  export async function getStaticPaths() {
    const allPosts = await getCollection("blog");
    const categories = ["etf", "news-rumor", "analyst-report", "insider-congress", "stock-data"] as const;
    return categories.map((category) => ({
      params: { category },
      props: {
        posts: allPosts
          .filter((p) => p.data.category === category)
          .sort((a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime()),
      },
    }));
  }

  const { category } = Astro.params;
  const { posts } = Astro.props;
  const label = CATEGORY_LABELS[category as ValidCategory] ?? category;
  ---

  <BaseLayout
    title={`${label} | 미국주식 블로그 | ${siteConfig.siteName}`}
    description={`미국주식 ${label} 관련 정보를 한국어로 정리합니다.`}
  >
    <div class="min-h-screen bg-slate-50">

      <!-- Dark Hero -->
      <div class="bg-slate-900">
        <div class="max-w-6xl mx-auto px-4 py-14">
          <nav class="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <a href="/blog" class="hover:text-cyan-400 transition-colors">블로그</a>
            <span>›</span>
            <span class="text-slate-300">{label}</span>
          </nav>
          <h1 class="text-white text-4xl font-bold tracking-tight leading-none mb-2">{label}</h1>
          <p class="text-slate-400 text-sm">{posts.length}개의 글</p>
        </div>
      </div>

      <!-- Category Filter Tabs -->
      <div class="bg-white border-b border-slate-200">
        <div class="max-w-6xl mx-auto px-4">
          <nav class="flex flex-wrap gap-1 py-3">
            <a
              href="/blog"
              class="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all duration-150"
            >
              전체
            </a>
            {CATEGORY_OPTIONS.map((cat) => (
              <a
                href={`/blog/category/${cat.value}`}
                class:list={[
                  "text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded transition-all duration-150",
                  cat.value === category
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100",
                ]}
              >
                {cat.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <!-- Card grid -->
      <div class="max-w-6xl mx-auto px-4 py-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
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

        {posts.length === 0 && (
          <p class="text-slate-500 text-center py-20">이 카테고리에 아직 게시물이 없습니다.</p>
        )}
      </div>

    </div>
  </BaseLayout>
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/pages/blog/category/[category].astro
  git commit -m "style: re-skin blog category page to industrial palette"
  ```

---

### Task 6: Re-skin Issue Radar page and IssueCard component

**Files:**
- Modify: `src/pages/radar.astro`
- Modify: `src/components/radar/IssueCard.astro`

- [ ] **Step 1: Write new IssueCard.astro** — status badges + slate/cyan skin:

  Write `src/components/radar/IssueCard.astro`:
  ```astro
  ---
  import type { DailyIssue } from "../../data/daily-issues";
  import { CtaButton } from "../ui/CtaButton";
  import { links } from "../../config/links";

  interface Props {
    issue: DailyIssue;
  }

  const { issue } = Astro.props;

  const ISSUE_BADGE: Record<string, string> = {
    "확인된 사실": "bg-emerald-100 text-emerald-700",
    "시장 관측": "bg-blue-100 text-blue-700",
    "루머": "bg-amber-100 text-amber-700",
  };
  const badgeClass = ISSUE_BADGE[issue.category] ?? "bg-slate-100 text-slate-700";
  ---

  <article class="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <span class={`rounded px-3 py-1 text-xs font-bold uppercase tracking-wide ${badgeClass}`}>
        {issue.category}
      </span>
      <div class="flex flex-wrap gap-1.5">
        {issue.relatedSymbols.map((sym) => (
          <span class="bg-slate-100 text-slate-600 text-xs font-mono font-semibold rounded px-2 py-0.5">
            {sym}
          </span>
        ))}
      </div>
    </div>

    <h2 class="text-slate-900 text-xl font-bold leading-snug mb-5">{issue.headline}</h2>

    <dl class="space-y-4 text-sm leading-6">
      <div>
        <dt class="text-slate-900 font-semibold mb-1">확인된 사실</dt>
        <dd class="text-slate-600">{issue.confirmedFacts}</dd>
      </div>
      <div>
        <dt class="text-slate-900 font-semibold mb-1">시장 관측</dt>
        <dd class="text-slate-600">{issue.marketObservation}</dd>
      </div>
      <div>
        <dt class="text-slate-900 font-semibold mb-1">투자자가 볼 포인트</dt>
        <dd>
          <ul class="mt-1 list-disc list-inside space-y-1 text-slate-600">
            {issue.watchPoints.map((point) => <li>{point}</li>)}
          </ul>
        </dd>
      </div>
      <div>
        <dt class="text-slate-900 font-semibold mb-1">앱에서 확인 가능한 데이터</dt>
        <dd class="flex flex-wrap gap-2 mt-1">
          {issue.appDataPoints.map((point) => (
            <span class="bg-slate-100 text-slate-600 rounded px-2 py-0.5 text-xs">{point}</span>
          ))}
        </dd>
      </div>
    </dl>

    <div class="mt-6">
      <CtaButton href={links.playStore} label="앱에서 자세히 보기" />
    </div>
  </article>
  ```

- [ ] **Step 2: Write new radar.astro** — dark hero + slate issue list:

  Write `src/pages/radar.astro`:
  ```astro
  ---
  export const prerender = true;
  import BaseLayout from "../layouts/BaseLayout.astro";
  import IssueCard from "../components/radar/IssueCard.astro";
  import { CtaButton } from "../components/ui/CtaButton";
  import { dailyIssues } from "../data/daily-issues";
  import { siteConfig } from "../config/site";
  import { links } from "../config/links";
  ---

  <BaseLayout title={siteConfig.radarPageTitle} description={siteConfig.defaultDescription}>
    <div class="min-h-screen bg-slate-50">

      <!-- Dark Hero -->
      <div class="bg-slate-900">
        <div class="mx-auto max-w-6xl px-4 py-14">
          <span class="inline-block bg-cyan-600/20 text-cyan-400 text-[11px] font-bold uppercase tracking-widest rounded px-3 py-1 mb-4">
            Market Intelligence Radar
          </span>
          <p class="text-slate-400 text-sm font-medium mb-2">오늘 시장에서 많이 이야기되는 이슈 정리</p>
          <h1 class="text-white text-4xl font-bold sm:text-5xl tracking-tight leading-none mb-4">
            {siteConfig.radarPageTitle}
          </h1>
          <p class="max-w-3xl text-slate-400 text-base leading-7 mb-8">
            오늘 미국장에서 많이 이야기되는 이슈를 확인된 사실과 시장 관측으로 나눠 한눈에 확인하세요.
          </p>
          <CtaButton client:load href={links.playStore} label="구글플레이에서 앱 내려받기" />
          <p class="mt-3 text-xs text-slate-500">현재 Android(구글 플레이) 서비스 중입니다. iOS 버전도 준비 중입니다.</p>
        </div>
      </div>

      <!-- Issue list -->
      <div class="mx-auto max-w-6xl px-4 py-12">
        <div class="grid gap-6">
          {dailyIssues.map((issue) => <IssueCard issue={issue} />)}
        </div>

        <!-- Disclaimer -->
        <div class="mt-8 rounded-lg border border-amber-200 bg-amber-50 px-5 py-4 text-xs leading-6 text-amber-800">
          {siteConfig.radarDisclaimer}
        </div>
      </div>

    </div>
  </BaseLayout>
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add src/pages/radar.astro src/components/radar/IssueCard.astro
  git commit -m "style: re-skin issue radar and IssueCard to industrial palette"
  ```

---

### Task 7: Build verification

**Files:** None (read-only)

- [ ] **Step 1: Run build to verify no TypeScript/Astro errors**

  Run: `cd C:/Users/USER/code/datadnp-us-landing && npm run build`

  Expected: build completes with 0 errors (warnings about prerender are OK)

  If build fails, check for:
  - Missing imports (e.g. `CATEGORY_LABELS` in any file)
  - TypeScript errors in BlogPostLayout (CollectionEntry types)
  - Astro template syntax errors

- [ ] **Step 2: Commit if any fixes were needed**

  ```bash
  git add -A
  git commit -m "fix: resolve build errors after industrial redesign"
  ```
