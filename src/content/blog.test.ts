import { describe, expect, it } from "vitest";

// We validate the schema shape manually since Astro content APIs
// are not available in vitest (no Vite plugin for astro:content).
// This test validates the Zod schema directly.
import { blogFrontmatterSchema } from "../content.config";

describe("blogFrontmatterSchema", () => {
  it("accepts a valid post payload", () => {
    const result = blogFrontmatterSchema.safeParse({
      title: "QQQ ETF 보유 종목과 빅테크 비중 정리",
      description: "QQQ ETF의 주요 보유 종목과 빅테크 비중을 정리합니다.",
      category: "etf",
      tags: ["QQQ", "ETF"],
      publishedAt: "2026-05-01",
      updatedAt: "2026-05-01",
      ctaType: "etf",
      disclaimer: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects an unknown category", () => {
    const result = blogFrontmatterSchema.safeParse({
      title: "Test",
      description: "Test description",
      category: "unknown-category",
      tags: ["test"],
      publishedAt: "2026-05-01",
      updatedAt: "2026-05-01",
      ctaType: "etf",
      disclaimer: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a description over 180 characters", () => {
    const result = blogFrontmatterSchema.safeParse({
      title: "Test",
      description: "a".repeat(181),
      category: "etf",
      tags: ["test"],
      publishedAt: "2026-05-01",
      updatedAt: "2026-05-01",
      ctaType: "etf",
      disclaimer: true,
    });
    expect(result.success).toBe(false);
  });
});
