import { describe, expect, it } from "vitest";
import { buildCtaEvent } from "./analytics";

describe("buildCtaEvent", () => {
  it("returns a CtaEvent object with the provided fields", () => {
    expect(
      buildCtaEvent({
        sourcePage: "radar",
        sourceSection: "issue-card",
        campaign: "tiktok",
      })
    ).toEqual({
      sourcePage: "radar",
      sourceSection: "issue-card",
      campaign: "tiktok",
    });
  });

  it("allows campaign to be omitted", () => {
    const result = buildCtaEvent({
      sourcePage: "index",
      sourceSection: "hero",
    });
    expect(result.sourcePage).toBe("index");
    expect(result.sourceSection).toBe("hero");
    expect(result.campaign).toBeUndefined();
  });
});
