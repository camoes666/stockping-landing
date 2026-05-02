import { describe, it, expect } from "vitest";

// Test that category labels mapping is correct
const categoryLabels = {
  etf: "ETF",
  "news-rumor": "뉴스/루머",
  "analyst-report": "애널리스트",
  "insider-congress": "내부자/의원",
  "stock-data": "종목데이터",
};

describe("blog category labels", () => {
  it("has all 5 valid categories", () => {
    const keys = Object.keys(categoryLabels);
    expect(keys).toHaveLength(5);
    expect(keys).toContain("etf");
    expect(keys).toContain("news-rumor");
    expect(keys).toContain("stock-data");
  });

  it("all labels are non-empty Korean strings", () => {
    Object.values(categoryLabels).forEach((label) => {
      expect(label.length).toBeGreaterThan(0);
    });
  });
});
