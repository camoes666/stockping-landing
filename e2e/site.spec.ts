import { test, expect } from "@playwright/test";

test("home page shows the radar entry CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /미국장 정보와 이슈/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /이슈 레이더 보기/i })).toBeVisible();
});

test("radar page shows issue cards and a disclaimer", async ({ page }) => {
  await page.goto("/radar");
  await expect(page.getByRole("heading", { name: "오늘의 미국장 이슈 레이더" })).toBeVisible();
  await expect(page.getByText("확인된 사실").first()).toBeVisible();
  await expect(page.getByText("시장 관측").first()).toBeVisible();
  await expect(page.getByText("투자자가 볼 포인트").first()).toBeVisible();
  // inline disclaimer must appear right after issue cards (no scroll needed)
  await expect(page.getByText(/특정 종목의 매수·매도 추천이 아닙니다/).first()).toBeVisible();
});

test("iOS notice is visible near Play Store CTA without scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); // iPhone 14
  await page.goto("/radar");
  await expect(page.getByText(/Android.*전용/)).toBeVisible();
});
