// Checks/renders the design study, not the app. Temporary GIF frames stay in .cache.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "../../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs";
const root = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(root, "../../..");
const origin = process.env.DESIGN_URL || "http://127.0.0.1:5182";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || "/tmp/chromium",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 1500 },
    deviceScaleFactor: 1.5,
  });
  const errors = [],
    requests = [],
    failed = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => requests.push(r.url()));
  page.on("response", (r) => {
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
  });
  await page.goto(`${origin}/revision-bleu/`);
  await page.evaluate(() => document.fonts.ready);
  const light = page.locator("[data-concept=light]");
  const dark = page.locator("[data-concept=dark]");
  const ring = light.locator(".ring.middle");
  const transform = () => ring.evaluate((el) => getComputedStyle(el).transform);
  const before = await transform();
  await page.waitForTimeout(180);
  assert.notEqual(await transform(), before, "Orb must actually turn");
  await page.locator("#motion-toggle").click();
  assert.equal(
    await ring.evaluate((el) => getComputedStyle(el).animationPlayState),
    "paused",
  );
  await page.locator("#motion-toggle").click();
  assert.equal(
    await ring.evaluate((el) => getComputedStyle(el).animationPlayState),
    "running",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await ring.evaluate((el) => getComputedStyle(el).animationName),
    "none",
  );
  // matchMedia's change event is asynchronous even after style recalculation.
  await page.waitForFunction(
    () => document.querySelector("#motion-toggle").disabled,
  );
  assert.equal(await page.locator("#motion-toggle").isDisabled(), true);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.waitForFunction(
    () => !document.querySelector("#motion-toggle").disabled,
  );
  const blue = await light
    .locator(".orb-core")
    .evaluate((el) => getComputedStyle(el).backgroundImage);
  for (const theme of [light, dark]) {
    for (const name of ["Émilie", "Yanis"]) {
      await theme.getByRole("button", { name, exact: true }).click();
      assert.equal(await theme.locator("[data-name]").textContent(), name);
      assert.equal(
        await theme
          .locator(".orb-core")
          .evaluate((el) => getComputedStyle(el).backgroundImage),
        blue,
        "Blue must not follow the profile color",
      );
      assert.equal(await theme.locator("[aria-pressed=true]").count(), 1);
      for (const width of [320, 360, 390, 520, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 1600 });
        const layouts = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth,
          screens: [...document.querySelectorAll(".concept .screen")].map(
            (screen) => ({
              theme: screen.dataset.theme,
              gap:
                screen.querySelector(".bottom-nav").getBoundingClientRect()
                  .top -
                screen.querySelector(".content").getBoundingClientRect().bottom,
              clipped: [
                ...screen.querySelectorAll(
                  "h2,h3,button,p,.day-rail,.profile-strip,.hero-facts,.hero-topline",
                ),
              ]
                .filter((el) => el.scrollWidth > el.clientWidth + 1)
                .map((el) => el.className || el.tagName),
              photo:
                screen.querySelector(".hero-photo").complete &&
                screen.querySelector(".hero-photo").naturalWidth > 0,
              heroOverlap:
                screen.querySelector(".hero-bottom").getBoundingClientRect()
                  .top -
                screen.querySelector(".hero-copy").getBoundingClientRect()
                  .bottom,
            }),
          ),
        }));
        assert.equal(layouts.overflow, false, `Overflow ${name} ${width}`);
        for (const layout of layouts.screens) {
          assert.ok(
            layout.gap >= 8,
            `Nav overlap ${name} ${width} ${JSON.stringify(layout)}`,
          );
          assert.deepEqual(
            layout.clipped,
            [],
            `Clipped text ${name} ${width} ${layout.theme}`,
          );
          assert.ok(layout.photo, "Original photo must load");
          assert.ok(
            layout.heroOverlap >= 0,
            `Hero content overlaps footer at ${width}`,
          );
        }
      }
    }
  }
  await light.getByRole("button", { name: "Émilie", exact: true }).click();
  assert.equal(
    await dark.locator("[data-name]").textContent(),
    "Yanis",
    "Demo profiles are independent",
  );
  await light.getByRole("button", { name: "Yanis", exact: true }).click();
  for (const selector of [
    ".hero-start",
    ".hero-programme",
    ".listen",
    ".task",
    ".bell",
    ".bottom-nav button:last-child",
  ]) {
    await light.locator(selector).click();
    assert.equal(await page.locator(".toast").isVisible(), true);
  }
  await page.evaluate(() => (document.querySelector(".toast").hidden = true));
  assert.equal(await page.evaluate(() => localStorage.length), 0);
  assert.equal(await page.evaluate(() => sessionStorage.length), 0);
  assert.deepEqual(errors, []);
  assert.deepEqual(failed, []);
  assert.ok(
    requests.every((url) => url.startsWith(`${origin}/`)),
    "No external requests",
  );
  assert.equal(
    await page
      .locator("use")
      .evaluateAll(
        (els) =>
          els.filter((el) => !document.querySelector(el.getAttribute("href")))
            .length,
      ),
    0,
  );
  await page.setViewportSize({ width: 1200, height: 1600 });
  await page.evaluate(() =>
    document.getAnimations().forEach((a) => {
      a.pause();
      a.currentTime = 1300;
    }),
  );
  for (const theme of ["light", "dark"])
    await page.locator(`[data-concept=${theme}]`).screenshot({
      path: path.join(
        root,
        `maquette-${theme === "light" ? "claire" : "sombre"}.png`,
      ),
    });
  await page
    .locator(".concept-grid")
    .screenshot({ path: path.join(root, "comparatif.png") });
  if (process.env.RENDER_GIF === "1") {
    const frames = path.join(repo, ".cache/revision-design/orb-frames");
    fs.mkdirSync(frames, { recursive: true });
    for (let i = 0; i < 100; i++) {
      await page.evaluate(
        (time) =>
          document.getAnimations().forEach((a) => {
            a.pause();
            a.currentTime = time;
          }),
        i * 80,
      );
      await page.locator("#orb-demo").screenshot({
        path: path.join(frames, `${String(i).padStart(3, "0")}.png`),
        scale: "css",
      });
    }
    console.log(
      "100 deterministic animation frames exported to .cache (8-second loop).",
    );
  }
  console.log(
    "Design only: light/dark × both profiles × 7 widths; original photo; blue orb preserved; rotation/pause/reduced-motion checks; no overflow, clipping, nav or hero overlap; isolated profiles/inert actions; no storage, external request, missing assets/icons or JS error. PNGs exported. APK not touched.",
  );
} finally {
  await browser.close();
}
