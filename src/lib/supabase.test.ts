import { describe, it, expect } from "vitest";
import { rowToIssue } from "./supabase";
import type { DailyIssueRow } from "./supabase";

const sampleRow: DailyIssueRow = {
  id: 1,
  created_at: "2026-05-04T00:00:00Z",
  headline: "테스트 이슈",
  category: "시장 관측",
  related_symbols: ["NVDA", "AMD"],
  confirmed_facts: "확인된 사실 텍스트",
  market_observation: "시장 관측 텍스트",
  watch_points: ["포인트1", "포인트2"],
  app_data_points: ["데이터1"],
  is_published: true,
  display_order: 0,
};

describe("rowToIssue", () => {
  it("maps snake_case DB columns to camelCase DailyIssue fields", () => {
    const issue = rowToIssue(sampleRow);
    expect(issue.headline).toBe("테스트 이슈");
    expect(issue.category).toBe("시장 관측");
    expect(issue.relatedSymbols).toEqual(["NVDA", "AMD"]);
    expect(issue.confirmedFacts).toBe("확인된 사실 텍스트");
    expect(issue.marketObservation).toBe("시장 관측 텍스트");
    expect(issue.watchPoints).toEqual(["포인트1", "포인트2"]);
    expect(issue.appDataPoints).toEqual(["데이터1"]);
  });

  it("does not include id, created_at, is_published, or display_order in the result", () => {
    const issue = rowToIssue(sampleRow) as Record<string, unknown>;
    expect(issue["id"]).toBeUndefined();
    expect(issue["created_at"]).toBeUndefined();
    expect(issue["is_published"]).toBeUndefined();
    expect(issue["display_order"]).toBeUndefined();
  });
});
