// Render and check only the isolated design study. Never opens the installed app/store.
// Requires npm ci --prefix JARVIS-Fitness-Source and a local Chromium binary.
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { chromium } from "../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs";
const root = path.dirname(fileURLToPath(import.meta.url));
const url = process.env.DESIGN_URL || "http://127.0.0.1:5181";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || "/tmp/chromium",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1500 },
  deviceScaleFactor: 1.5,
});
const errors = [],
  requests = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("request", (r) => requests.push(r.url()));
await page.goto(url);
await page.evaluate(() => document.fonts.ready);
assert.equal(await page.locator(".concept").count(), 3);
for (const width of [320, 360, 390, 768, 1024, 1280, 1440]) {
  await page.setViewportSize({ width, height: 1500 });
  const layout = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    viewport: innerWidth,
    gaps: [...document.querySelectorAll(".concept")].map((c) => ({
      id: c.dataset.concept,
      gap:
        c.querySelector(".bottom-nav").getBoundingClientRect().top -
        c.querySelector(".content").getBoundingClientRect().bottom,
    })),
  }));
  assert.ok(
    layout.width <= layout.viewport,
    `Horizontal overflow at ${width}px`,
  );
  for (const g of layout.gaps)
    assert.ok(
      g.gap >= 0,
      `Content under navigation: ${g.id} at ${width}px (${g.gap})`,
    );
}
const a = page.locator('[data-concept="a"]');
await a.getByRole("button", { name: "Émilie", exact: true }).click();
assert.equal(await a.locator("[data-name]").textContent(), "Émilie");
assert.equal(await a.locator(".session-name").textContent(), "Corps entier");
assert.equal(
  await page.locator('[data-concept="b"] [data-name]').textContent(),
  "Yanis",
);
await a.getByRole("button", { name: "Préparer ma séance" }).click();
assert.match(
  await page.locator(".toast").textContent(),
  /aucune séance lancée/,
);
assert.equal(await page.evaluate(() => localStorage.length), 0);
assert.equal(await page.evaluate(() => sessionStorage.length), 0);
await a.getByRole("button", { name: "Yanis", exact: true }).click();
await page.evaluate(() => (document.querySelector(".toast").hidden = true));
assert.deepEqual(errors, []);
assert.ok(
  requests.every((r) => r.startsWith(url)),
  "Unexpected external request",
);
await page
  .locator(".presentation")
  .screenshot({ path: path.join(root, "propositions-accueil.png") });
for (const id of ["a", "b", "c"])
  await page
    .locator(`[data-concept="${id}"]`)
    .screenshot({ path: path.join(root, `proposition-${id}.png`) });
await browser.close();
console.log(
  "Design only: 3 concepts; 7 widths without overflow/overlap; isolated demo profile switch; no personal store, external request or JS error.",
);
console.log(
  "Rendered comparison and three individual proposals. No APK modified.",
);
