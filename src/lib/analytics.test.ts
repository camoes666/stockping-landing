import { describe, expect, it } from "vitest";
import { buildCtaEvent } from "./analytics";

describe("buildCtaEvent", () => {
  it("normalizes CTA metadata", () => {
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
});
