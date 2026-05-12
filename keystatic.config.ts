import { config, collection, fields } from "@keystatic/core";

export default config({
  storage: {
    kind: "cloud",
  },
  cloud: {
    project: "camoes/stockping-landing",
  },
  ui: {
    brand: { name: "Stockping CMS" },
  },
  collections: {
    blog: collection({
      label: "블로그 글",
      slugField: "title",
      path: "src/content/blog/*",
      format: { contentField: "content" },
      entryLayout: "content",
      schema: {
        title: fields.slug({
          name: { label: "제목", validation: { isRequired: true } },
        }),
        description: fields.text({
          label: "설명 (검색 노출용, 최대 180자)",
          multiline: false,
          validation: { isRequired: true, length: { max: 180 } },
        }),
        category: fields.select({
          label: "카테고리",
          options: [
            { label: "ETF", value: "etf" },
            { label: "뉴스/루머", value: "news-rumor" },
            { label: "애널리스트 리포트", value: "analyst-report" },
            { label: "내부자/의원 거래", value: "insider-congress" },
            { label: "종목 데이터", value: "stock-data" },
          ],
          defaultValue: "etf",
        }),
        tags: fields.text({
          label: "태그 (쉼표로 구분)",
          description: "예: 미국주식, ETF, 애널리스트리포트",
          validation: { isRequired: true },
        }),
        publishedAt: fields.date({
          label: "발행일",
          validation: { isRequired: true },
        }),
        updatedAt: fields.date({
          label: "수정일",
          validation: { isRequired: true },
        }),
        thumbnail: fields.image({
          label: "썸네일 이미지",
          directory: "public/blog-images",
          publicPath: "/blog-images/",
        }),
        ctaType: fields.select({
          label: "CTA 유형",
          options: [
            { label: "랜딩 (기본)", value: "landing" },
            { label: "오늘의 이슈", value: "today" },
            { label: "ETF 분석", value: "etf" },
            { label: "애널리스트 리포트", value: "report" },
            { label: "내부자 거래", value: "insider" },
            { label: "의원 매매", value: "congress" },
          ],
          defaultValue: "landing",
        }),
        disclaimer: fields.checkbox({
          label: "투자 유의사항 표시",
          defaultValue: true,
        }),
        content: fields.mdx({
          label: "본문",
        }),
      },
    }),
  },
});
