import { defineCollection, z } from "astro:content";

export const blogFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).max(180),
  category: z.enum(["etf", "news-rumor", "analyst-report", "insider-congress", "stock-data"]),
  tags: z.union([
    z.array(z.string()),
    z.string().transform((s) => s.split(",").map((t) => t.trim().replace(/^#/, "")).filter(Boolean)),
  ]).pipe(z.array(z.string()).min(1)),
  publishedAt: z.union([z.string(), z.date().transform((d) => d.toISOString().split("T")[0])]),
  updatedAt: z.union([z.string(), z.date().transform((d) => d.toISOString().split("T")[0])]),
  thumbnail: z.string().optional(),
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
