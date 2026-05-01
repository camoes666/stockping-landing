import { test, expect } from "@playwright/test";

test("home page shows the radar entry CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /미국장 정보와 이슈/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /이슈 레이더 보기/i })).toBeVisible();
});
