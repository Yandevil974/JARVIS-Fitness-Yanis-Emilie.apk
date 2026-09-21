// Render/check only the isolated light study, never the application or APK.
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "../../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs";
const root = path.dirname(fileURLToPath(import.meta.url));
const origin = process.env.DESIGN_URL || "http://127.0.0.1:5181";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || "/tmp/chromium",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
try {
  const page = await browser.newPage({
    viewport: { width: 900, height: 1500 },
    deviceScaleFactor: 1.5,
  });
  const errors = [],
    requests = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => requests.push(r.url()));
  await page.goto(`${origin}/clair/`);
  await page.evaluate(() => document.fonts.ready);
  for (const person of ["Yanis", "Émilie"]) {
    await page.getByRole("button", { name: person, exact: true }).click();
    assert.equal(await page.locator("[data-name]").textContent(), person);
    assert.equal(
      await page.locator("[data-session]").textContent(),
      person === "Yanis" ? "Haut du corps" : "Corps entier",
    );
    assert.equal(await page.locator('[aria-pressed="true"]').count(), 1);
    const accent = await page
      .locator(".screen")
      .evaluate((el) =>
        getComputedStyle(el).getPropertyValue("--accent").trim(),
      );
    assert.equal(
      accent,
      person === "Yanis" ? "hsl(30 88% 44%)" : "hsl(334 74% 50%)",
    );
    for (const width of [320, 360, 390, 520, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1500 });
      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        gap:
          document.querySelector(".bottom-nav").getBoundingClientRect().top -
          document.querySelector(".content").getBoundingClientRect().bottom,
        clipped: [
          ...document.querySelectorAll(
            "h2,h3,button,p,.day-rail,.profile-strip",
          ),
        ]
          .filter((e) => e.scrollWidth > e.clientWidth + 1)
          .map((e) => e.className || e.tagName),
        missingIcons: [...document.querySelectorAll("use")]
          .map((e) => e.getAttribute("href"))
          .filter((id) => !document.querySelector(id)),
      }));
      assert.equal(layout.overflow, false, `${person}: overflow at ${width}`);
      assert.ok(
        layout.gap >= 10,
        `${person}: nav clearance ${layout.gap} at ${width}`,
      );
      assert.deepEqual(
        layout.clipped,
        [],
        `${person}: clipped content at ${width}`,
      );
      assert.deepEqual(layout.missingIcons, []);
    }
    await page.setViewportSize({ width: 900, height: 1500 });
    await page
      .locator("#maquette")
      .screenshot({
        path: path.join(
          root,
          `maquette-${person === "Yanis" ? "yanis" : "emilie"}.png`,
        ),
      });
  }
  for (const selector of [
    ".primary",
    ".listen",
    ".task",
    ".programme",
    ".bell",
    ".bottom-nav button:last-child",
  ]) {
    await page.locator(selector).click();
    assert.equal(await page.locator(".toast").isVisible(), true);
    assert.match(await page.locator(".toast").textContent(), /aucune action/);
  }
  assert.equal(await page.evaluate(() => localStorage.length), 0);
  assert.equal(await page.evaluate(() => sessionStorage.length), 0);
  assert.deepEqual(errors, []);
  assert.ok(
    requests.every((r) => r.startsWith(`${origin}/`)),
    "External request",
  );
  console.log(
    "Light mockup only: two profile palettes, 7 widths each, no clipping/overlap/missing icons, inert actions, empty web storage, no external requests or JavaScript errors. Two PNGs exported.",
  );
} finally {
  await browser.close();
}
