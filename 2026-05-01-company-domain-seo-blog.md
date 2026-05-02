# Company Domain SEO Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first production-ready version of the company-domain SEO blog that turns organic traffic into tracked Play Store download visits.

**Architecture:** Use Astro as the static-first application shell, MDX content collections for blog posts, and a few isolated React islands only where interactivity is needed. Keep the first release deployable on Cloudflare Pages with static pages plus a minimal server endpoint for `/download` click tracking and Supabase writes.

**Tech Stack:** Astro, TypeScript, MDX, React, Astro Content Collections, Vitest, Playwright, Supabase, Cloudflare Pages

---

## File Structure

- `package.json`
  Purpose: define Astro app scripts, dependencies, linting, and test commands.
- `astro.config.mjs`
  Purpose: configure Astro integrations, output mode, sitemap site URL, and Cloudflare adapter settings.
- `tsconfig.json`
  Purpose: shared TypeScript configuration for Astro, tests, and React components.
- `src/content.config.ts`
  Purpose: validate blog frontmatter schema.
- `src/content/blog/*.mdx`
  Purpose: versioned blog content with SEO metadata and CTA targeting.
- `src/layouts/BaseLayout.astro`
  Purpose: global HTML shell, metadata injection, analytics hooks, and shared header/footer.
- `src/layouts/BlogPostLayout.astro`
  Purpose: post template wiring hero, metadata, TOC, content, related posts, disclaimer, and CTA.
- `src/components/blog/*.astro`
  Purpose: reusable blog UI such as cards, post meta, CTA, related posts, optimized image, disclaimer, and share buttons.
- `src/components/common/Header.astro`
  Purpose: global top navigation.
- `src/components/common/Footer.astro`
  Purpose: global footer with legal links.
- `src/pages/index.astro`
  Purpose: landing page for the app.
- `src/pages/blog/index.astro`
  Purpose: blog listing page.
- `src/pages/blog/[slug].astro`
  Purpose: static blog detail page generation.
- `src/pages/blog/[category].astro`
  Purpose: category archive page generation.
- `src/pages/today.astro`
  Purpose: “today’s US market issues” feature page.
- `src/pages/etf.astro`
  Purpose: ETF feature landing page.
- `src/pages/report.astro`
  Purpose: analyst report feature landing page.
- `src/pages/insider.astro`
  Purpose: insider trading feature landing page.
- `src/pages/congress.astro`
  Purpose: congress trading feature landing page.
- `src/pages/download.astro`
  Purpose: tracked redirect page entry point with graceful fallback.
- `src/pages/api/download-click.ts`
  Purpose: accept tracking payloads and persist them to Supabase.
- `src/lib/blog.ts`
  Purpose: content query helpers for lists, related posts, categories, and URL creation.
- `src/lib/seo.ts`
  Purpose: metadata builders for canonical, OG, robots, and JSON-LD.
- `src/lib/download.ts`
  Purpose: CTA query parsing and tracking request helpers.
- `src/lib/env.ts`
  Purpose: typed environment variable access.
- `src/styles/global.css`
  Purpose: shared design tokens and global styling.
- `public/robots.txt`
  Purpose: crawler policy.
- `public/manifest.json`
  Purpose: install metadata and icon declarations.
- `src/pages/rss.xml.ts`
  Purpose: RSS feed generation.
- `src/pages/sitemap-index.xml.ts`
  Purpose: sitemap generation when custom handling is needed.
- `supabase/migrations/20260501_create_tracking_tables.sql`
  Purpose: create `download_clicks`, `rumors`, `media_assets`, and `content_performance`.
- `tests/unit/blog.test.ts`
  Purpose: validate blog helper behavior.
- `tests/unit/seo.test.ts`
  Purpose: validate SEO builder output.
- `tests/unit/download.test.ts`
  Purpose: validate tracking payload normalization.
- `tests/e2e/blog.spec.ts`
  Purpose: verify core browse and CTA flows in the browser.

### Task 1: Project Scaffold And Tooling

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/env.d.ts`
- Create: `src/styles/global.css`
- Test: `npm run test`

- [ ] **Step 1: Write the failing package and test script setup**

```json
{
  "name": "datadnp-blog",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@astrojs/cloudflare": "^12.6.0",
    "@astrojs/mdx": "^4.3.0",
    "@astrojs/react": "^4.3.0",
    "@astrojs/rss": "^4.0.11",
    "@astrojs/sitemap": "^3.6.0",
    "@supabase/supabase-js": "^2.49.8",
    "astro": "^5.7.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "zod": "^3.24.4"
  },
  "devDependencies": {
    "@playwright/test": "^1.54.1",
    "typescript": "^5.8.3",
    "vitest": "^3.1.4"
  }
}
```

- [ ] **Step 2: Run install to verify the workspace is missing dependencies before setup completes**

Run: `npm install`
Expected: packages install successfully and `node_modules` is created

- [ ] **Step 3: Write the minimal Astro configuration**

```js
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://datadnp.co.kr",
  output: "server",
  adapter: cloudflare(),
  integrations: [mdx(), react(), sitemap()]
});
```

- [ ] **Step 4: Add base TypeScript and Astro environment files**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

```ts
/// <reference types="astro/client" />
```

- [ ] **Step 5: Add global design token starter styles**

```css
:root {
  --bg: #f6f1e8;
  --surface: #fffdf8;
  --text: #1c1a17;
  --muted: #655f58;
  --line: #e4d8c6;
  --accent: #0b5d4b;
  --accent-strong: #063d31;
  --max-width: 1160px;
  --radius: 20px;
  --shadow: 0 18px 40px rgba(20, 23, 21, 0.08);
}

html {
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
  background: var(--bg);
  color: var(--text);
}

body {
  margin: 0;
}
```

- [ ] **Step 6: Run unit tests to verify the empty suite boots successfully**

Run: `npm run test`
Expected: Vitest exits successfully with either zero tests or discovered starter tests

- [ ] **Step 7: Commit**

```bash
git add package.json astro.config.mjs tsconfig.json src/env.d.ts src/styles/global.css
git commit -m "chore: scaffold astro blog application"
```

### Task 2: Content Schema And Seed Posts

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/blog/qqq-etf-holdings.mdx`
- Create: `src/content/blog/us-stock-rumor-check.mdx`
- Test: `tests/unit/blog.test.ts`

- [ ] **Step 1: Write the failing schema validation test**

```ts
import { describe, expect, it } from "vitest";
import { blogFrontmatterSchema } from "@/content.config";

describe("blogFrontmatterSchema", () => {
  it("accepts a valid post payload", () => {
    const parsed = blogFrontmatterSchema.parse({
      title: "QQQ ETF 보유 종목과 빅테크 비중 정리",
      description: "QQQ ETF의 주요 보유 종목과 빅테크 비중을 정리합니다.",
      slug: "qqq-etf-holdings",
      category: "etf",
      tags: ["QQQ", "ETF"],
      publishedAt: "2026-05-01",
      updatedAt: "2026-05-01",
      thumbnail: "https://cdn.datadnp.co.kr/blog/2026/05/qqq-etf-holdings/thumbnail.webp",
      related: ["us-stock-rumor-check"],
      ctaType: "etf",
      disclaimer: true
    });

    expect(parsed.slug).toBe("qqq-etf-holdings");
  });
});
```

- [ ] **Step 2: Run the schema test to confirm it fails because the schema does not exist yet**

Run: `npm run test -- tests/unit/blog.test.ts`
Expected: FAIL with module resolution error for `@/content.config`

- [ ] **Step 3: Write the frontmatter schema and collection config**

```ts
import { defineCollection, z } from "astro:content";

export const blogFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).max(180),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  category: z.enum(["etf", "news-rumor", "analyst-report", "insider-congress", "stock-data"]),
  tags: z.array(z.string()).min(1),
  publishedAt: z.string(),
  updatedAt: z.string(),
  thumbnail: z.string().url(),
  related: z.array(z.string()).default([]),
  ctaType: z.enum(["landing", "today", "etf", "report", "insider", "congress"]),
  disclaimer: z.boolean().default(true)
});

const blogCollection = defineCollection({
  type: "content",
  schema: blogFrontmatterSchema
});

export const collections = {
  blog: blogCollection
};
```

- [ ] **Step 4: Add two fully populated seed posts**

```mdx
---
title: "QQQ ETF 보유 종목과 빅테크 비중 정리"
description: "QQQ ETF의 주요 보유 종목과 빅테크 비중을 한국 투자자 눈높이에 맞게 정리합니다."
slug: "qqq-etf-holdings"
category: "etf"
tags:
  - "QQQ"
  - "ETF"
  - "나스닥100"
publishedAt: "2026-05-01"
updatedAt: "2026-05-01"
thumbnail: "https://cdn.datadnp.co.kr/blog/2026/05/qqq-etf-holdings/thumbnail.webp"
related:
  - "us-stock-rumor-check"
ctaType: "etf"
disclaimer: true
---

## QQQ ETF를 볼 때 먼저 봐야 할 것

QQQ는 이름보다 실제 보유 종목 비중이 더 중요합니다.
```

```mdx
---
title: "미국주식 루머, 어디까지 믿어야 할까?"
description: "미국주식 루머를 볼 때 투자자가 함께 확인해야 할 데이터 기준을 정리합니다."
slug: "us-stock-rumor-check"
category: "news-rumor"
tags:
  - "미국주식"
  - "루머"
  - "체크리스트"
publishedAt: "2026-05-01"
updatedAt: "2026-05-01"
thumbnail: "https://cdn.datadnp.co.kr/blog/2026/05/us-stock-rumor-check/thumbnail.webp"
related:
  - "qqq-etf-holdings"
ctaType: "today"
disclaimer: true
---

## 루머는 단독으로 보지 않습니다

가격 움직임, 거래량, 공식 공시를 함께 확인해야 합니다.
```

- [ ] **Step 5: Run the schema test again**

Run: `npm run test -- tests/unit/blog.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/content.config.ts src/content/blog/qqq-etf-holdings.mdx src/content/blog/us-stock-rumor-check.mdx tests/unit/blog.test.ts
git commit -m "feat: add blog content schema and seed posts"
```

### Task 3: Shared Layouts And Core Components

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/layouts/BlogPostLayout.astro`
- Create: `src/components/common/Header.astro`
- Create: `src/components/common/Footer.astro`
- Create: `src/components/blog/CTABox.astro`
- Create: `src/components/blog/DisclaimerBox.astro`
- Create: `src/components/blog/PostMeta.astro`
- Create: `src/components/blog/RelatedPosts.astro`
- Create: `src/components/blog/BlogCard.astro`
- Test: `tests/unit/seo.test.ts`

- [ ] **Step 1: Write the failing metadata builder test**

```ts
import { describe, expect, it } from "vitest";
import { buildSeoMeta } from "@/lib/seo";

describe("buildSeoMeta", () => {
  it("builds canonical and og defaults for a blog post", () => {
    const meta = buildSeoMeta({
      title: "QQQ ETF 보유 종목과 빅테크 비중 정리",
      description: "QQQ ETF의 보유 종목 비중을 정리합니다.",
      pathname: "/blog/qqq-etf-holdings",
      image: "https://cdn.datadnp.co.kr/blog/2026/05/qqq-etf-holdings/thumbnail.webp"
    });

    expect(meta.canonical).toBe("https://datadnp.co.kr/blog/qqq-etf-holdings");
    expect(meta.ogType).toBe("article");
  });
});
```

- [ ] **Step 2: Run the metadata test to verify it fails**

Run: `npm run test -- tests/unit/seo.test.ts`
Expected: FAIL with module resolution error for `@/lib/seo`

- [ ] **Step 3: Write the SEO helper and base layout**

```ts
export type SeoMetaInput = {
  title: string;
  description: string;
  pathname: string;
  image?: string;
  type?: "website" | "article";
};

export function buildSeoMeta(input: SeoMetaInput) {
  return {
    canonical: `https://datadnp.co.kr${input.pathname}`,
    title: input.title,
    description: input.description,
    image: input.image,
    ogType: input.type ?? "article"
  };
}
```

```astro
---
import Header from "@/components/common/Header.astro";
import Footer from "@/components/common/Footer.astro";
import "@/styles/global.css";

interface Props {
  title: string;
  description: string;
  canonical: string;
  image?: string;
}

const { title, description, canonical, image } = Astro.props;
---

<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    {image && <meta property="og:image" content={image} />}
  </head>
  <body>
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 4: Write the minimal shared UI components**

```astro
---
---

<header class="site-header">
  <a href="/">datadnp</a>
  <nav>
    <a href="/blog">블로그</a>
    <a href="/today">오늘의 이슈</a>
    <a href="/download?source=header&cta=nav">다운로드</a>
  </nav>
</header>
```

```astro
---
---

<footer class="site-footer">
  <a href="/privacy">개인정보처리방침</a>
  <a href="/terms">이용약관</a>
</footer>
```

```astro
---
interface Props {
  ctaType: "landing" | "today" | "etf" | "report" | "insider" | "congress";
  postSlug?: string;
}

const { ctaType, postSlug } = Astro.props;
const hrefMap = {
  landing: "/",
  today: "/today",
  etf: "/etf",
  report: "/report",
  insider: "/insider",
  congress: "/congress"
};
const targetHref = `/download?source=blog&post=${postSlug ?? ""}&cta=bottom&target=${encodeURIComponent(hrefMap[ctaType])}`;
---

<aside class="cta-box">
  <h2>미국주식 정보, 이제 한곳에서 확인하세요.</h2>
  <p>뉴스, 루머, ETF, 리포트, 내부자 거래를 한 화면에서 확인할 수 있습니다.</p>
  <a href={targetHref}>플레이스토어 다운로드</a>
</aside>
```

- [ ] **Step 5: Run the metadata test again**

Run: `npm run test -- tests/unit/seo.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/seo.ts src/layouts/BaseLayout.astro src/components/common/Header.astro src/components/common/Footer.astro src/components/blog/CTABox.astro src/components/blog/DisclaimerBox.astro src/components/blog/PostMeta.astro src/components/blog/RelatedPosts.astro src/components/blog/BlogCard.astro tests/unit/seo.test.ts
git commit -m "feat: add shared layouts and seo primitives"
```

### Task 4: Blog Data Helpers And Listing Pages

**Files:**
- Create: `src/lib/blog.ts`
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[category].astro`
- Test: `tests/unit/blog.test.ts`

- [ ] **Step 1: Extend the failing helper test for category and sort behavior**

```ts
import { describe, expect, it } from "vitest";
import { sortPostsByDate, uniqueCategories } from "@/lib/blog";

describe("blog helpers", () => {
  it("sorts newer posts first", () => {
    const result = sortPostsByDate([
      { data: { publishedAt: "2026-05-01" } },
      { data: { publishedAt: "2026-04-20" } }
    ]);

    expect(result[0].data.publishedAt).toBe("2026-05-01");
  });

  it("returns distinct categories", () => {
    const categories = uniqueCategories([
      { data: { category: "etf" } },
      { data: { category: "news-rumor" } },
      { data: { category: "etf" } }
    ]);

    expect(categories).toEqual(["etf", "news-rumor"]);
  });
});
```

- [ ] **Step 2: Run the helper test to confirm the new exports are missing**

Run: `npm run test -- tests/unit/blog.test.ts`
Expected: FAIL with missing exports from `@/lib/blog`

- [ ] **Step 3: Implement the minimal blog helpers**

```ts
export function sortPostsByDate<T extends { data: { publishedAt: string } }>(posts: T[]) {
  return [...posts].sort((a, b) => b.data.publishedAt.localeCompare(a.data.publishedAt));
}

export function uniqueCategories<T extends { data: { category: string } }>(posts: T[]) {
  return [...new Set(posts.map((post) => post.data.category))];
}
```

- [ ] **Step 4: Build the blog index and category archive pages**

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "@/layouts/BaseLayout.astro";
import BlogCard from "@/components/blog/BlogCard.astro";
import { sortPostsByDate } from "@/lib/blog";

const posts = sortPostsByDate(await getCollection("blog"));
---

<BaseLayout
  title="미국주식 정보 블로그"
  description="ETF, 루머, 리포트, 내부자 거래를 한국 투자자 눈높이에 맞게 설명합니다."
  canonical="https://datadnp.co.kr/blog"
>
  <section>
    <h1>미국주식 정보 블로그</h1>
    {posts.map((post) => <BlogCard post={post} />)}
  </section>
</BaseLayout>
```

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "@/layouts/BaseLayout.astro";
import BlogCard from "@/components/blog/BlogCard.astro";
import { sortPostsByDate, uniqueCategories } from "@/lib/blog";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return uniqueCategories(posts).map((category) => ({
    params: { category },
    props: {
      posts: sortPostsByDate(posts.filter((post) => post.data.category === category)),
      category
    }
  }));
}

const { posts, category } = Astro.props;
---

<BaseLayout
  title={`${category} | datadnp 블로그`}
  description={`${category} 카테고리 글 목록입니다.`}
  canonical={`https://datadnp.co.kr/blog/${category}`}
>
  <section>
    <h1>{category}</h1>
    {posts.map((post) => <BlogCard post={post} />)}
  </section>
</BaseLayout>
```

- [ ] **Step 5: Run the helper tests**

Run: `npm run test -- tests/unit/blog.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/blog.ts src/pages/blog/index.astro src/pages/blog/[category].astro tests/unit/blog.test.ts
git commit -m "feat: add blog listing and category archive pages"
```

### Task 5: Blog Detail Page, Related Content, And Disclaimer Flow

**Files:**
- Create: `src/pages/blog/[slug].astro`
- Modify: `src/layouts/BlogPostLayout.astro`
- Modify: `src/components/blog/RelatedPosts.astro`
- Modify: `src/components/blog/DisclaimerBox.astro`
- Test: `tests/e2e/blog.spec.ts`

- [ ] **Step 1: Write the failing end-to-end blog post flow test**

```ts
import { test, expect } from "@playwright/test";

test("blog detail page shows article, disclaimer, and download CTA", async ({ page }) => {
  await page.goto("/blog/qqq-etf-holdings");
  await expect(page.getByRole("heading", { name: "QQQ ETF 보유 종목과 빅테크 비중 정리" })).toBeVisible();
  await expect(page.getByText("투자 판단의 최종 책임은 본인에게 있습니다.")).toBeVisible();
  await expect(page.getByRole("link", { name: "플레이스토어 다운로드" })).toHaveAttribute("href", /\/download\?/);
});
```

- [ ] **Step 2: Run the e2e test to verify the post route does not exist yet**

Run: `npm run test:e2e -- tests/e2e/blog.spec.ts`
Expected: FAIL with 404 or route missing assertion failure

- [ ] **Step 3: Implement static blog detail generation**

```astro
---
import { getCollection, render } from "astro:content";
import BlogPostLayout from "@/layouts/BlogPostLayout.astro";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.data.slug },
    props: { post }
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<BlogPostLayout post={post}>
  <Content />
</BlogPostLayout>
```

- [ ] **Step 4: Implement the post layout with related posts and disclaimer toggle**

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import CTABox from "@/components/blog/CTABox.astro";
import DisclaimerBox from "@/components/blog/DisclaimerBox.astro";
import PostMeta from "@/components/blog/PostMeta.astro";

interface Props {
  post: {
    data: {
      title: string;
      description: string;
      slug: string;
      thumbnail: string;
      ctaType: "landing" | "today" | "etf" | "report" | "insider" | "congress";
      disclaimer: boolean;
      publishedAt: string;
      updatedAt: string;
    };
  };
}

const { post } = Astro.props;
---

<BaseLayout
  title={post.data.title}
  description={post.data.description}
  canonical={`https://datadnp.co.kr/blog/${post.data.slug}`}
  image={post.data.thumbnail}
>
  <article>
    <h1>{post.data.title}</h1>
    <PostMeta publishedAt={post.data.publishedAt} updatedAt={post.data.updatedAt} />
    <slot />
    {post.data.disclaimer && <DisclaimerBox />}
    <CTABox ctaType={post.data.ctaType} postSlug={post.data.slug} />
  </article>
</BaseLayout>
```

```astro
---
---

<aside class="disclaimer-box">
  <strong>투자 유의 문구</strong>
  <p>투자 판단의 최종 책임은 본인에게 있습니다. 본 글은 정보 제공 목적입니다.</p>
</aside>
```

- [ ] **Step 5: Run the end-to-end test again**

Run: `npm run test:e2e -- tests/e2e/blog.spec.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/pages/blog/[slug].astro src/layouts/BlogPostLayout.astro src/components/blog/RelatedPosts.astro src/components/blog/DisclaimerBox.astro tests/e2e/blog.spec.ts
git commit -m "feat: add blog detail page with disclaimer and cta"
```

### Task 6: Landing, Feature Pages, And Download Tracking

**Files:**
- Create: `src/lib/download.ts`
- Create: `src/lib/env.ts`
- Create: `src/pages/index.astro`
- Create: `src/pages/today.astro`
- Create: `src/pages/etf.astro`
- Create: `src/pages/report.astro`
- Create: `src/pages/insider.astro`
- Create: `src/pages/congress.astro`
- Create: `src/pages/download.astro`
- Create: `src/pages/api/download-click.ts`
- Test: `tests/unit/download.test.ts`

- [ ] **Step 1: Write the failing download payload normalization test**

```ts
import { describe, expect, it } from "vitest";
import { normalizeDownloadParams } from "@/lib/download";

describe("normalizeDownloadParams", () => {
  it("maps a blog CTA request into a tracking payload", () => {
    const payload = normalizeDownloadParams(
      new URL("https://datadnp.co.kr/download?source=blog&post=qqq-etf-holdings&cta=bottom&utm_source=seo&utm_medium=organic")
    );

    expect(payload.source).toBe("blog");
    expect(payload.post_slug).toBe("qqq-etf-holdings");
    expect(payload.cta_position).toBe("bottom");
  });
});
```

- [ ] **Step 2: Run the download test to verify the helper is missing**

Run: `npm run test -- tests/unit/download.test.ts`
Expected: FAIL with module resolution error for `@/lib/download`

- [ ] **Step 3: Implement the minimal download helper and env access**

```ts
export function normalizeDownloadParams(url: URL) {
  return {
    source: url.searchParams.get("source") ?? "direct",
    post_slug: url.searchParams.get("post"),
    cta_position: url.searchParams.get("cta") ?? "unknown",
    utm_source: url.searchParams.get("utm_source"),
    utm_medium: url.searchParams.get("utm_medium"),
    utm_campaign: url.searchParams.get("utm_campaign"),
    referrer: url.searchParams.get("ref") ?? null
  };
}
```

```ts
const required = ["PUBLIC_SITE_URL", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"] as const;

export function getEnv(name: (typeof required)[number]) {
  const value = import.meta.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}
```

- [ ] **Step 4: Build the feature landing pages and tracked download page**

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
---

<BaseLayout
  title="미국주식 정보, 흩어져 보지 말고 쉽게 이해하세요."
  description="뉴스, 루머, ETF, 리포트, 내부자 거래를 한국 투자자 관점으로 정리하는 앱."
  canonical="https://datadnp.co.kr/"
>
  <section>
    <h1>미국주식 정보, 흩어져 보지 말고 쉽게 이해하세요.</h1>
    <a href="/download?source=landing&cta=hero">플레이스토어 다운로드</a>
  </section>
</BaseLayout>
```

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
const target = "https://play.google.com/store/apps/details?id=com.datadnp.app";
---

<BaseLayout
  title="앱 다운로드"
  description="앱 다운로드를 위해 이동 중입니다."
  canonical="https://datadnp.co.kr/download"
>
  <section>
    <h1>앱 다운로드로 이동합니다</h1>
    <p>잠시 후 플레이스토어로 이동합니다.</p>
    <a href={target}>직접 이동</a>
    <script is:inline>
      const params = new URLSearchParams(window.location.search);
      fetch(`/api/download-click?${params.toString()}`, { method: "POST" }).finally(() => {
        window.location.href = "https://play.google.com/store/apps/details?id=com.datadnp.app";
      });
    </script>
  </section>
</BaseLayout>
```

```ts
import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { getEnv } from "@/lib/env";
import { normalizeDownloadParams } from "@/lib/download";

export const POST: APIRoute = async ({ request, url }) => {
  const supabase = createClient(getEnv("SUPABASE_URL"), getEnv("SUPABASE_SERVICE_ROLE_KEY"));
  const payload = normalizeDownloadParams(url);

  await supabase.from("download_clicks").insert(payload);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" }
  });
};
```

- [ ] **Step 5: Run the unit test again**

Run: `npm run test -- tests/unit/download.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/download.ts src/lib/env.ts src/pages/index.astro src/pages/today.astro src/pages/etf.astro src/pages/report.astro src/pages/insider.astro src/pages/congress.astro src/pages/download.astro src/pages/api/download-click.ts tests/unit/download.test.ts
git commit -m "feat: add landing pages and tracked download flow"
```

### Task 7: SEO System Files, RSS, And Search Readiness

**Files:**
- Create: `public/robots.txt`
- Create: `public/manifest.json`
- Create: `src/pages/rss.xml.ts`
- Create: `src/pages/sitemap-index.xml.ts`
- Create: `src/pages/privacy.astro`
- Create: `src/pages/terms.astro`
- Test: `tests/e2e/blog.spec.ts`

- [ ] **Step 1: Extend the e2e test to cover crawlable pages**

```ts
import { test, expect } from "@playwright/test";

test("legal and blog index pages are reachable", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.getByRole("heading", { name: "미국주식 정보 블로그" })).toBeVisible();

  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: "개인정보처리방침" })).toBeVisible();
});
```

- [ ] **Step 2: Run the e2e suite and confirm new pages are missing**

Run: `npm run test:e2e -- tests/e2e/blog.spec.ts`
Expected: FAIL with missing `/privacy` route or assertions

- [ ] **Step 3: Add robots, manifest, RSS, sitemap, and legal pages**

```txt
User-agent: *
Allow: /

Sitemap: https://datadnp.co.kr/sitemap-index.xml
```

```json
{
  "name": "datadnp blog",
  "short_name": "datadnp",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f6f1e8",
  "theme_color": "#0b5d4b",
  "icons": []
}
```

```ts
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("blog");

  return rss({
    title: "datadnp 미국주식 정보 블로그",
    description: "미국주식 데이터 해설 블로그",
    site: context.site ?? "https://datadnp.co.kr",
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.publishedAt),
      link: `/blog/${post.data.slug}`
    }))
  });
}
```

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
---

<BaseLayout
  title="개인정보처리방침"
  description="datadnp 개인정보처리방침"
  canonical="https://datadnp.co.kr/privacy"
>
  <section>
    <h1>개인정보처리방침</h1>
    <p>다운로드 추적과 서비스 운영을 위한 최소한의 정보를 수집합니다.</p>
  </section>
</BaseLayout>
```

- [ ] **Step 4: Run the e2e suite again**

Run: `npm run test:e2e -- tests/e2e/blog.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add public/robots.txt public/manifest.json src/pages/rss.xml.ts src/pages/sitemap-index.xml.ts src/pages/privacy.astro src/pages/terms.astro tests/e2e/blog.spec.ts
git commit -m "feat: add seo system files and legal pages"
```

### Task 8: Supabase Schema And Deployment Readiness

**Files:**
- Create: `supabase/migrations/20260501_create_tracking_tables.sql`
- Create: `.env.example`
- Create: `README.md`
- Test: `npm run build`

- [ ] **Step 1: Write the failing build check before environment docs exist**

Run: `npm run build`
Expected: FAIL until all pages, imports, and configuration are wired correctly

- [ ] **Step 2: Add the SQL schema for tracking and media metadata**

```sql
create table if not exists download_clicks (
  id bigint generated always as identity primary key,
  source text not null,
  post_slug text,
  cta_position text not null,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  created_at timestamptz not null default now()
);

create table if not exists rumors (
  id bigint generated always as identity primary key,
  symbol text not null,
  title text not null,
  source_url text,
  status text not null default 'unverified',
  created_at timestamptz not null default now()
);

create table if not exists media_assets (
  id bigint generated always as identity primary key,
  asset_type text not null,
  title text not null,
  description text,
  file_url text not null,
  thumbnail_url text,
  alt_text text,
  caption text,
  credit text,
  license_type text,
  related_post_slug text,
  related_feature text,
  storage_provider text not null,
  file_size integer,
  width integer,
  height integer,
  duration integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists content_performance (
  id bigint generated always as identity primary key,
  post_slug text not null,
  page_views integer not null default 0,
  cta_clicks integer not null default 0,
  download_visits integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

- [ ] **Step 3: Add environment and deployment documentation**

```env
PUBLIC_SITE_URL=https://datadnp.co.kr
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

```md
# datadnp blog

## Setup

1. Run `npm install`
2. Copy `.env.example` to `.env`
3. Run `npm run dev`

## Test

- `npm run test`
- `npm run test:e2e`
- `npm run build`

## Deploy

Deploy to Cloudflare Pages with the same environment variables as `.env.example`.
```

- [ ] **Step 4: Run the full verification suite**

Run: `npm run test && npm run build`
Expected: PASS for both unit tests and production build

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20260501_create_tracking_tables.sql .env.example README.md
git commit -m "chore: add deployment and database setup"
```

## Self-Review

- Spec coverage:
  - Astro blog structure: covered by Tasks 1, 3, 4, and 5.
  - `/blog`, `/blog/[slug]`, `/download`: covered by Tasks 4, 5, and 6.
  - Feature pages `/today`, `/etf`, `/report`, `/insider`, `/congress`: covered by Task 6.
  - CTA and tracked download flow: covered by Tasks 3 and 6.
  - SEO files `sitemap`, `robots`, `rss`, `manifest`: covered by Task 7.
  - Supabase tables `download_clicks`, `rumors`, `media_assets`, `content_performance`: covered by Task 8.
  - Seed markdown content and frontmatter rules: covered by Task 2.
  - Legal pages: covered by Task 7.
- Placeholder scan:
  - Removed generic “add validation later” language.
  - All tasks include explicit files, commands, and code snippets.
- Type consistency:
  - `ctaType` enum is consistent across schema and CTA component.
  - `normalizeDownloadParams` output fields match the `download_clicks` table columns.
  - Category slugs are consistent between schema and archive routing.

## 2026-05-01 Scope Update

The original plan above covers the first release of the SEO blog and landing funnel. After initial implementation, the project scope expanded in these ways:

- The admin editor is no longer just an MDX draft helper. It now needs to become a real admin workspace.
- Image and video insertion inside blog posts is required.
- Category management can no longer stay hard-coded in source files. Admin users need category create, rename, and delete flows.
- Post authoring should move toward Supabase-backed draft storage rather than file-only creation.

Because of that scope change, the next implementation phase should not keep extending the original static-content-only assumptions. A dedicated admin CMS extension plan is required, with Supabase as the source of truth for categories, drafts, and media metadata.

See:
- `docs/superpowers/plans/2026-05-01-admin-cms-extension.md`

Current implementation status before the CMS phase:

- Static blog, landing pages, `/today`, `/download`, SEO files, and Supabase tracking schema are implemented.
- `/admin/editor` currently exists as a front-end draft builder only.
- The current editor does not yet support category CRUD, persisted drafts, image blocks, or video blocks.
