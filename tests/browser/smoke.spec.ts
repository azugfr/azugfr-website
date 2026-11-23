import { expect, test, type Page } from "@playwright/test";

const PAGES = [
  "/fr/",
  "/en/",
  "/fr/events/",
  "/fr/events/global-azure-france-2026/",
  "/en/events/build-2026-localhost-paris-2026-06-10/",
  "/fr/about/",
  "/en/about/",
  "/fr/speakers/",
  "/fr/speakers/achraf-ben-alaya/",
  "/fr/speakers/jean-luc-boucho/",
  "/fr/global-azure-france/",
  "/fr/resources/",
  "/fr/news/",
  "/fr/search/",
];

/** Records same-origin responses with status >= 400. Attach before navigating. */
function collectFailures(page: Page, baseURL: string | undefined): string[] {
  const failures: string[] = [];
  page.on("response", (response) => {
    const url = response.url();
    if (baseURL && url.startsWith(baseURL) && response.status() >= 400) {
      failures.push(`${response.status()} ${new URL(url).pathname}`);
    }
  });
  return failures;
}

/** Images that finished loading but rendered with zero width (broken). */
function brokenImages(page: Page): Promise<string[]> {
  return page.$$eval("img", (imgs) =>
    imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
  );
}

test("fr home has no failed same-origin requests", async ({ page, baseURL }) => {
  const failed = collectFailures(page, baseURL);
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

// 1 + 2. No same-origin 4xx/5xx and no broken images on each listed page.
test.describe("page health", () => {
  for (const path of PAGES) {
    test(`no same-origin errors on ${path}`, async ({ page, baseURL }) => {
      const failures = collectFailures(page, baseURL);
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      expect(failures).toEqual([]);
    });

    test(`no broken images on ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      expect(await brokenImages(page)).toEqual([]);
    });
  }
});

test.describe("about organizers", () => {
  test("board shows five organizer cards with no local organizer photos", async ({ page }) => {
    await page.goto("/fr/about/");
    // Only the direct card items: #board li also matches nested distinction and expertise tags.
    const cards = page.locator("#board > ul > li");
    await expect(cards).toHaveCount(5);
    await expect(page.locator('img[src*="/organizers/"]')).toHaveCount(0);
    for (let i = 0; i < 5; i++) {
      await expect(cards.nth(i).locator("h3")).toBeVisible();
      expect((await cards.nth(i).locator("h3").innerText()).trim().length).toBeGreaterThan(0);
    }
  });
});

test.describe("upcoming section is honest", () => {
  test("events page: every upcoming time is not in the past", async ({ page }) => {
    await page.goto("/fr/events/");
    const datetimes = await page.$$eval("#upcoming time[datetime]", (els) =>
      els.map((el) => el.getAttribute("datetime") ?? ""),
    );
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    for (const dt of datetimes) expect(Date.parse(dt)).toBeGreaterThanOrEqual(cutoff);
  });

  test("events page: upcoming does not list Global Azure France 2026, past does", async ({ page }) => {
    await page.goto("/fr/events/");
    await expect(page.locator("#upcoming")).not.toContainText("Global Azure France 2026");
    await expect(page.locator("#past a[href^='/fr/events/global-azure-france-2026']").first()).toBeVisible();
  });

  test("home next-event slot never presents a past event as upcoming", async ({ page }) => {
    await page.goto("/fr/");
    const slot = page.locator('[data-testid="next-event"]');
    await expect(slot).not.toContainText("Global Azure France 2026");

    // The "latest event" card (labelled Dernier événement / Latest event) is intentionally past,
    // so only <time> elements outside that card are checked against the upcoming cutoff.
    const datetimes = await slot.locator("time[datetime]").evaluateAll((els) =>
      els
        .filter((el) => !el.closest('[class*="md:w-80"]'))
        .map((el) => el.getAttribute("datetime") ?? ""),
    );
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    for (const dt of datetimes) expect(Date.parse(dt)).toBeGreaterThanOrEqual(cutoff);
  });
});

test.describe("event detail renders talks", () => {
  test("GA 2026 agenda lists five talks, including the AI ROI talk and its speaker link", async ({ page }) => {
    await page.goto("/fr/events/global-azure-france-2026/");
    await expect(page.locator('[data-testid="agenda"] [data-testid="talk"]')).toHaveCount(5);
    await expect(page.locator("body")).toContainText(/ROI de l.IA/);
    await expect(page.locator('a[href^="/fr/speakers/jean-luc-boucho"]').first()).toBeVisible();
  });

  test("GA 2026 has no S'inscrire link or button", async ({ page }) => {
    await page.goto("/fr/events/global-azure-france-2026/");
    await expect(page.getByRole("link", { name: "S'inscrire" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "S'inscrire" })).toHaveCount(0);
  });

  test("EN GA 2026 page shows the English talk title", async ({ page }) => {
    await page.goto("/en/events/global-azure-france-2026/");
    await expect(page.locator("body")).toContainText("The AI ROI challenge");
  });

  test("GA 2026 JSON-LD is a schema.org Event in Paris", async ({ page }) => {
    await page.goto("/fr/events/global-azure-france-2026/");
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const events = blocks.map((b) => JSON.parse(b)).filter((j) => j["@type"] === "Event");
    expect(events).toHaveLength(1);
    expect(events[0].startDate).toBe("2026-04-18T09:00:00+02:00");
    expect(events[0].location.address.addressLocality).toBe("Paris");
  });
});

test.describe("Global Azure France editions", () => {
  test("editions 2023-2026 are listed; 2026 links to its event; no S'inscrire", async ({ page }) => {
    await page.goto("/fr/global-azure-france/");
    const cards = page.locator('[data-testid="ga-edition"]');
    const years = await cards.evaluateAll((els) => els.map((el) => el.getAttribute("data-year")));
    for (const y of ["2023", "2024", "2025", "2026"]) expect(years).toContain(y);

    await expect(cards.getByRole("link", { name: "S'inscrire" })).toHaveCount(0);
    await expect(
      page.locator('[data-testid="ga-edition"][data-year="2026"] a[href^="/fr/events/global-azure-france-2026"]').first(),
    ).toBeVisible();
  });
});

test.describe("locale switch and alternates", () => {
  test("FR event detail switches to EN and keeps the event", async ({ page }) => {
    await page.goto("/fr/events/global-azure-france-2026/");
    await page.getByRole("link", { name: "English" }).first().click();
    await expect(page).toHaveURL(/\/en\/events\/global-azure-france-2026\/?$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("EN about switches to FR about", async ({ page }) => {
    await page.goto("/en/about/");
    await page.getByRole("link", { name: "Français" }).first().click();
    await expect(page).toHaveURL(/\/fr\/about\/?$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  });

  test("FR event detail advertises its EN alternate", async ({ page }) => {
    await page.goto("/fr/events/global-azure-france-2026/");
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      "href",
      /\/en\/events\/global-azure-france-2026\/?$/,
    );
  });
});

test("speakers index lists at least 40 cards and no placeholder speaker", async ({ page }) => {
  await page.goto("/fr/speakers/");
  const cards = page.locator("main ul.grid > li");
  expect(await cards.count()).toBeGreaterThanOrEqual(40);
  await expect(page.getByText("Marie Dupont")).toHaveCount(0);
});

test.describe("footer", () => {
  test("no Sponsors or Code de conduite links; Contact is mailto; upcoming links to #upcoming", async ({ page }) => {
    await page.goto("/fr/");
    const footer = page.locator("footer");
    const labels = await footer.locator("a").allInnerTexts();
    expect(labels.filter((t) => /sponsors|code de conduite/i.test(t))).toEqual([]);

    await expect(footer.getByRole("link", { name: "Contact", exact: true })).toHaveAttribute("href", /^mailto:/);
    await expect(footer.getByRole("link", { name: "À venir", exact: true })).toHaveAttribute("href", /#upcoming$/);
  });
});

test.describe("sitemap and robots", () => {
  test("sitemap index is served", async ({ request }) => {
    const res = await request.get("/sitemap-index.xml");
    expect(res.status()).toBe(200);
  });

  test("sitemap lists the GA 2026 event with both hreflang alternates", async ({ request }) => {
    const res = await request.get("/sitemap-0.xml");
    expect(res.status()).toBe(200);
    const body = await res.text();
    // Sitemap URLs carry a trailing slash; hreflang uses the en-GB / fr-FR region codes.
    expect(body).toMatch(/\/fr\/events\/global-azure-france-2026\/?<\/loc>/);
    expect(body).toContain('hreflang="fr-FR"');
    expect(body).toContain('hreflang="en-GB"');
  });

  test("robots.txt points at the sitemap", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    expect(await res.text()).toContain("Sitemap:");
  });
});
