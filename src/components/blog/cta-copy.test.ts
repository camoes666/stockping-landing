import { describe, it, expect } from "vitest";
import { ctaCopy } from "./cta-copy";

describe("ctaCopy", () => {
  it("has all 6 cta types", () => {
    const types = ["landing", "today", "etf", "report", "insider", "congress"];
    types.forEach((t) => expect(ctaCopy[t as keyof typeof ctaCopy]).toBeDefined());
  });

  it("each entry has headline and button", () => {
    Object.values(ctaCopy).forEach((copy) => {
      expect(copy.headline.length).toBeGreaterThan(0);
      expect(copy.button.length).toBeGreaterThan(0);
    });
  });
});
