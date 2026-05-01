import { describe, expect, it } from "vitest";
import { dailyIssues } from "./daily-issues";
import type { IssueCategory } from "./daily-issues";

describe("daily issues data", () => {
  it("contains between 3 and 5 issues", () => {
    expect(dailyIssues.length).toBeGreaterThanOrEqual(3);
    expect(dailyIssues.length).toBeLessThanOrEqual(5);
  });

  it("keeps confirmed facts separate from market observations", () => {
    expect(dailyIssues[0].confirmedFacts.length).toBeGreaterThan(0);
    expect(dailyIssues[0].marketObservation.length).toBeGreaterThan(0);
  });

  it("watchPoints and appDataPoints are arrays with at least one item", () => {
    dailyIssues.forEach((issue) => {
      expect(Array.isArray(issue.watchPoints)).toBe(true);
      expect(issue.watchPoints.length).toBeGreaterThan(0);
      expect(Array.isArray(issue.appDataPoints)).toBe(true);
      expect(issue.appDataPoints.length).toBeGreaterThan(0);
    });
  });

  it("every issue has a valid category", () => {
    const validCategories: IssueCategory[] = ["확인된 사실", "시장 관측", "루머"];
    dailyIssues.forEach((issue) => {
      expect(validCategories).toContain(issue.category);
    });
  });
});
