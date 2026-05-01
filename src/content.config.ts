import { defineCollection, z } from "astro:content";

export const blogFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).max(180),
  category: z.enum(["etf", "news-rumor", "analyst-report", "insider-congress", "stock-data"]),
  tags: z.array(z.string()).min(1),
  publishedAt: z.string(),
  updatedAt: z.string(),
  thumbnail: z.string().url().optional(),
  related: z.array(z.string()).default([]),
  ctaType: z.enum(["landing", "today", "etf", "report", "insider", "congress"]),
  disclaimer: z.boolean().default(true),
});

const blogCollection = defineCollection({
  type: "content",
  schema: blogFrontmatterSchema,
});

export const collections = {
  blog: blogCollection,
};
