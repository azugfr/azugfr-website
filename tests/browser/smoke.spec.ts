import { expect, test } from "@playwright/test";

test("fr home has no failed same-origin requests", async ({ page, baseURL }) => {
  const failed: string[] = [];

  page.on("response", (response) => {
    const url = response.url();
    if (baseURL && url.startsWith(baseURL) && response.status() >= 400) {
      failed.push(`${response.status()} ${new URL(url).pathname}`);
    }
  });

  await page.goto("/fr/");
  await page.waitForLoadState("networkidle");

  expect(failed).toEqual([]);
});

test("fr home renders hero and nav", async ({ page }) => {
  await page.goto("/fr/");
  const mainNav = page.getByRole("navigation", { name: "Main navigation" });

  await expect(page.getByRole("heading", { level: 1, name: "AZUG FR" })).toBeVisible();
  await expect(mainNav.locator('a[href="/fr/events"]')).toBeVisible();
  await expect(mainNav.locator('a[href="/fr/news"]')).toBeVisible();
});

test("en home renders and can switch locale", async ({ page }) => {
  await page.goto("/en/");

  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1, name: "AZUG FR" })).toBeVisible();

  await page.getByRole("link", { name: "Français" }).first().click();
  await expect(page).toHaveURL(/\/fr\/?$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
});

test("events and news listing pages are reachable", async ({ page }) => {
  await page.goto("/fr/events");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.goto("/fr/news");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
