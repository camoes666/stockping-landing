export const prerender = true;
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("blog");
  const sorted = posts.sort(
    (a, b) =>
      new Date(b.data.publishedAt).getTime() -
      new Date(a.data.publishedAt).getTime()
  );

  return rss({
    title: "미국주식 투자 정보 블로그",
    description:
      "ETF·뉴스·루머·애널리스트 리포트·내부자 거래를 한국어로 정리합니다.",
    site: context.site!,
    items: sorted.map((post) => {
      const slug = post.id.replace(/\.mdx?$/, "");
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: new Date(post.data.publishedAt),
        link: `/blog/${slug}/`,
      };
    }),
    customData: `<language>ko</language>`,
  });
}
