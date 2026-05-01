import { describe, expect, it } from "vitest";
import { siteConfig } from "./site";
import { links } from "./links";

describe("site configuration", () => {
  it("defines the radar page title", () => {
    expect(siteConfig.radarPageTitle).toBe("오늘의 미국장 이슈 레이더");
  });

  it("contains a Play Store url placeholder", () => {
    expect(links.playStore).toContain("play.google.com");
  });
});
