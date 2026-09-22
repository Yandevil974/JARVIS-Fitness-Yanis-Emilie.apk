// Renders the PATCHED 1.4.0 bundle in happy-dom (no browser available in this sandbox) and
// checks the screens touched by the media correction: home, timer (land Tabata / aqua / warm-up
// / stretches), exercise detail, pool protocol. Usage:
//   cd .cache/dom-tools && npm install happy-dom   (kept out of Git)
//   node evolution/media/build.mjs && node evolution/media/tests/dom-smoke.mjs
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = fileURLToPath(new URL("../../..", import.meta.url));
const require = createRequire(path.join(root, ".cache/dom-tools/package.json"));
const { Window } = require("happy-dom");
const { initialState } = await import(pathToFileURL(path.join(root, "JARVIS-Fitness-Source/src/store/model.js")));
const { createTimer } = await import(pathToFileURL(path.join(root, "JARVIS-Fitness-Source/src/engine/timer.js")));
const web = path.join(root, process.env.MEDIA_WEB || ".cache/media-web");
const bundle = path.join(web, "assets/index-CBCies4k.js");
const exists = (p) => fs.existsSync(path.join(web, p.replace(/^\//, "")));

const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok: !!ok, detail });
  console.log(`${ok ? "ok " : "FAIL"} ${name}${detail ? " — " + detail : ""}`);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function boot(prepare) {
  const window = new Window({ url: "http://127.0.0.1:8080/", width: 1280, height: 900 });
  const state = initialState();
  state.activeProfile = "elite";
  for (const p of Object.values(state.profiles)) {
    p.timer = null;
    p.preferences.theme = "light";
    p.preferences.voice = false;
    p.preferences.reducedMotion = true;
    p.measurements = [];
  }
  prepare?.(state);
  window.localStorage.setItem("jarvis_fitness_v3", JSON.stringify(state));
  window.document.body.innerHTML = '<div id="root"></div>';
  const g = globalThis;
  const keys = ["window", "document", "navigator", "localStorage", "sessionStorage", "HTMLElement", "Element", "Node", "CustomEvent", "Event", "MutationObserver", "getComputedStyle", "requestAnimationFrame", "cancelAnimationFrame", "matchMedia", "Image", "HTMLImageElement", "HTMLCanvasElement", "SVGElement", "Text", "DOMParser", "Blob", "URL", "location", "history", "IntersectionObserver", "ResizeObserver", "MessageChannel", "self"];
  const saved = {};
  const define = (k, value) => Object.defineProperty(g, k, { value, configurable: true, writable: true });
  for (const k of keys) {
    saved[k] = Object.getOwnPropertyDescriptor(g, k);
    try {
      const v = window[k];
      if (v !== undefined) define(k, typeof v === "function" && !/^[A-Z]/.test(k) ? v.bind(window) : v);
    } catch {}
  }
  define("window", window);
  define("self", window);
  if (!g.IntersectionObserver) g.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  if (!g.ResizeObserver) g.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
  window.IntersectionObserver = g.IntersectionObserver;
  window.ResizeObserver = g.ResizeObserver;
  window.speechSynthesis = { speak() {}, cancel() {}, getVoices: () => [], addEventListener() {} };
  window.scrollTo = () => {};
  const errors = [];
  window.addEventListener("error", (e) => errors.push(String(e.message || e.error)));
  const onRejection = (e) => errors.push("unhandled: " + (e && e.stack ? e.stack.split("\n")[0] : e));
  process.on("unhandledRejection", onRejection);
  const origError = console.error;
  const consoleErrors = [];
  console.error = (...a) => { consoleErrors.push(a.map(String).join(" ").slice(0, 300)); };
  try {
    await import(pathToFileURL(bundle).href + "?t=" + Date.now() + Math.random());
  } catch (e) {
    errors.push("import: " + (e.stack || e));
  }
  for (let i = 0; i < 120 && !window.document.querySelector(".training-hero"); i++) await sleep(50);
  await sleep(400);
  // A seeded timer is reachable through the approved home card ("Voir le chrono" / "Reprendre le chrono").
  const chrono = [...window.document.querySelectorAll("button")].find((b) => /Voir le chrono|Reprendre le chrono/.test(b.textContent));
  if (chrono) { chrono.click(); for (let i = 0; i < 40 && !window.document.querySelector(".timer-modal"); i++) await sleep(50); await sleep(200); }
  return {
    window,
    doc: window.document,
    errors,
    consoleErrors,
    async close() {
      console.error = origError;
      process.off("unhandledRejection", onRejection);
      try { await window.happyDOM.close(); } catch {}
      for (const k of keys) if (saved[k] === undefined) delete g[k]; else Object.defineProperty(g, k, saved[k]);
    },
  };
}

const text = (el) => (el ? el.textContent.replace(/\s+/g, " ").trim() : "");
const imgs = (doc, sel = "img") => [...doc.querySelectorAll(sel)].map((i) => i.getAttribute("src"));
const click = (el) => { if (!el) throw Error("element not found"); el.click(); return sleep(120); };
const button = (doc, label, within = doc) => [...within.querySelectorAll("button")].find((b) => text(b) === label || b.getAttribute("aria-label") === label);
const buttonIncluding = (doc, part, within = doc) => [...within.querySelectorAll("button")].find((b) => text(b).includes(part));

// 1. Home renders, app boots without runtime error (patched module executes fully).
{
  const app = await boot();
  const hero = app.doc.querySelector(".training-hero");
  check("boot: home hero renders with the patched bundle", hero, text(hero).slice(0, 80));
  check("boot: no window errors", app.errors.length === 0, app.errors.join(" | ").slice(0, 400));
  check("boot: approved home orb present", app.doc.querySelector(".jh-core"));
  const names = [...app.doc.querySelectorAll(".sidebar button")].map(text);
  console.log("   sidebar:", names.join(" / "));
  await app.close();
}

// 2. Land Tabata timer: plank -> real plank GIF; jumping jacks -> explicit absence, never pool
//    consignes, never a pool GIF, never the breathing figure on an effort round.
{
  const steps = [
    { name: "Échauffement progressif", seconds: 120, pattern: "walk" },
    { name: "Gainage planche · round 1/8", seconds: 20, pattern: "static", kind: "work" },
    { name: "Récupération", seconds: 10, pattern: "breathe", kind: "rest" },
    { name: "Jumping jacks · round 2/8", seconds: 20, pattern: "walk", kind: "work" },
    { name: "Battements de jambes · round 3/8", seconds: 20, pattern: "walk", kind: "work" },
    { name: "Montées de genoux · round 4/8", seconds: 20, pattern: "walk", kind: "work" },
    { name: "Retour au calme", seconds: 120, pattern: "breathe" },
  ];
  const meta = { type: "hiit", name: "Tabata 20/10", rounds: 8, cycles: 1, work: 20, rest: 10 };
  for (const [index, expect] of [
    [1, { img: "/media/1317e405efd6ef2b.gif" }],
    [2, { breathing: true }],
    [3, { missing: true }],
    [4, { missing: true }],
    [5, { missing: true }],
    [6, { breathing: true }],
  ]) {
    const app = await boot((s) => {
      const t = createTimer(steps, meta);
      t.index = index;
      t.remaining = steps[index].seconds;
      t.deadline = Date.now() + steps[index].seconds * 1000;
      s.profiles.elite.timer = t;
    });
    const doc = app.doc;
    const screen = doc.querySelector(".timer-modal") || doc.body;
    const stepName = steps[index].name;
    const shown = imgs(screen, ".timer-step-visual img, .movement-visual img, .timer-guide img");
    const missing = screen.querySelector(".movement-missing");
    const breathing = screen.querySelector(".human-recovery-visual");
    const guide = screen.querySelector(".timer-guide");
    const label = `timer hiit [${stepName}]`;
    check(`${label}: timer modal rendered without error`, app.errors.length === 0 && screen.classList.contains("timer-modal") && text(screen).includes(stepName.split(" · ")[0]), app.errors.join(" | ").slice(0, 300) || text(screen).slice(0, 100));
    if (expect.img) check(`${label}: shows ${expect.img}`, shown.includes(expect.img), shown.join(","));
    if (expect.missing) check(`${label}: explicit absence, no image, no pool consignes`, missing && shown.length === 0 && !guide && !breathing, `imgs=${shown.join(",")} guide=${!!guide} breathing=${!!breathing}`);
    if (expect.breathing) check(`${label}: breathing guide for rest`, breathing && !missing, `imgs=${shown.join(",")}`);
    check(`${label}: no pool consignes on land`, !guide, text(guide).slice(0, 80));
    for (const src of shown) check(`${label}: file exists ${src}`, exists(src));
    await app.close();
  }
}

// 3. Aqua Tabata: pool guides with aquatic illustrations + consignes; same names as land resolve differently.
{
  const steps = [
    { name: "Marche aquatique douce", seconds: 120, pattern: "swim" },
    { name: "Montées de genoux · round 1/6", seconds: 20, pattern: "swim", kind: "work" },
    { name: "Ciseaux au bord · round 2/6", seconds: 20, pattern: "swim", kind: "work" },
    { name: "Gainage vertical · round 3/6", seconds: 20, pattern: "swim", kind: "work" },
    { name: "Battements de jambes · round 4/6", seconds: 20, pattern: "swim", kind: "work" },
    { name: "Récupération", seconds: 10, pattern: "breathe", kind: "rest" },
  ];
  const meta = { type: "aqua", name: "Aqua Tabata 20/10", rounds: 6, cycles: 1, work: 20, rest: 10 };
  for (const [index, img, guideText] of [
    [0, "/media/pool-marche-aquatique.jpg", "Marche aquatique"],
    [1, "/media/fe34482aa6faf932.gif", "Montées de genoux"],
    [2, "/media/64f9a3c89ee9369b.jpg", "Ciseaux au bord"],
    [3, "/media/3d29edbd3afb4da6.jpg", "Gainage au bord (vertical)"],
    [4, "/media/fd7c5fb1226873f6.gif", "Battements au bord"],
  ]) {
    const app = await boot((s) => {
      s.activeProfile = "emilie";
      const t = createTimer(steps, meta);
      t.index = index;
      t.remaining = steps[index].seconds;
      t.deadline = Date.now() + steps[index].seconds * 1000;
      s.profiles.emilie.timer = t;
    });
    const doc = app.doc;
    const screen = doc.querySelector(".timer-modal") || doc.body;
    const shown = imgs(screen, ".timer-step-visual img, .movement-visual img");
    const guide = screen.querySelector(".timer-guide");
    const label = `timer aqua [${steps[index].name}]`;
    check(`${label}: timer modal rendered without error`, app.errors.length === 0 && screen.classList.contains("timer-modal"), app.errors.join(" | ").slice(0, 300));
    check(`${label}: shows ${img}`, shown.includes(img), shown.join(","));
    const guideImg = guide && guide.querySelector("img");
    check(`${label}: pool consignes shown for ${guideText}`, guide && guideImg && guideImg.getAttribute("alt") === guideText && text(guide).length > 40, text(guide).slice(0, 80));
    check(`${label}: file exists`, exists(img));
    await app.close();
  }
}

// 4. Warm-up timer + stretch launcher steps (meta warmup / recovery).
{
  const cases = [
    { meta: { type: "warmup", name: "Échauffement" }, steps: [
      { name: "Mobilité hanches & chevilles", seconds: 60, pattern: "lunge", img: null, instruction: "x" },
      { name: "Activation fessiers", seconds: 60, pattern: "bridge", img: "/media/8eecb0152081ff26.gif", instruction: "x" },
      { name: "Approche 1 · 40 kg", seconds: 60, pattern: "squat", img: "/media/530326beb7c7a652.gif", instruction: "x" },
    ], expect: [{ missing: true }, { img: "/media/8eecb0152081ff26.gif" }, { img: "/media/530326beb7c7a652.gif" }] },
    { meta: { type: "recovery", name: "Étirements" }, steps: [
      { name: "Pigeon assis", seconds: 40, pattern: "breathe" },
      { name: "Mollet en escalier", seconds: 40, pattern: "breathe" },
      { name: "Talon vers la fesse (debout)", seconds: 40, pattern: "breathe" },
    ], expect: [{ img: "/media/stretch-piriforme.jpg" }, { missing: true }, { img: "/media/stretch-quad-debout.jpg" }] },
  ];
  for (const c of cases)
    for (let index = 0; index < c.steps.length; index++) {
      const app = await boot((s) => {
        const t = createTimer(c.steps, c.meta);
        t.index = index;
        t.remaining = c.steps[index].seconds;
        t.deadline = Date.now() + c.steps[index].seconds * 1000;
        s.profiles.elite.timer = t;
      });
      const doc = app.doc;
      const screen = doc.querySelector(".timer-modal") || doc.body;
      const shown = imgs(screen, ".timer-step-visual img, .movement-visual img");
      const missing = screen.querySelector(".movement-missing");
      const breathing = screen.querySelector(".human-recovery-visual");
      const e = c.expect[index];
      const label = `timer ${c.meta.type} [${c.steps[index].name}]`;
      check(`${label}: timer modal rendered without error`, app.errors.length === 0 && screen.classList.contains("timer-modal"), app.errors.join(" | ").slice(0, 300));
      if (e.img) check(`${label}: shows ${e.img}`, shown.includes(e.img), shown.join(","));
      if (e.missing) check(`${label}: explicit absence (not breathing figure, no substitute)`, missing && !breathing && shown.length === 0, `imgs=${shown.join(",")} breathing=${!!breathing}`);
      await app.close();
    }
}

// 5. Exercise detail through the real UI: library -> open cards.
{
  const app = await boot();
  const doc = app.doc;
  const training = [...doc.querySelectorAll(".sidebar button")].find((b) => text(b) === "Entraînement");
  await click(training);
  await sleep(300);
  const lib = [...doc.querySelectorAll("button")].find((b) => text(b).startsWith("Bibliothèque"));
  check("library: Bibliothèque tab found", lib, [...doc.querySelectorAll("button")].map(text).slice(0, 12).join(" / "));
  if (lib) {
    await click(lib);
    await sleep(400);
    const expectations = [
      ["Triceps dips", "/media/dips-triceps-corrige.gif", "exact"],
      ["Dips", "/media/dips-triceps-corrige.gif", "variante"],
      ["French press barre EZ", "/media/ea226c444f72de0f.gif", "exact"],
      ["Tractions (pull-up)", "/media/a8fb4616e53e9cb9.gif", "exact"],
      ["Tractions supination (chin-up)", "/media/ebc7379850a4ee2f.gif", "exact"],
      ["Hip thrust unilatéral", "/media/1519aacc58d53c5c.gif", "variante"],
      ["Step-up haut", "/media/37f614cd3432709b.gif", "exact"],
      ["Leg extension", null, "none"],
      ["Face pull à la poulie", null, "none"],
      ["Bird dog", "/media/aab0de0aad0c275a.gif", "exact"],
    ];
    const search = [...doc.querySelectorAll("input")].find((i) => i.parentElement && i.parentElement.className === "search-input");
    check("library: search field found", search);
    const setter = Object.getOwnPropertyDescriptor(app.window.HTMLInputElement.prototype, "value").set;
    for (const [name, img, level] of expectations) {
      setter.call(search, name);
      search.dispatchEvent(new app.window.Event("input", { bubbles: true }));
      await sleep(400);
      const card = [...doc.querySelectorAll("button.exercise-card-content")].find((b) => text(b.querySelector("h3")) === name);
      if (!card) { check(`detail [${name}]: card found`, false, "cards: " + [...doc.querySelectorAll("button.exercise-card-content h3")].slice(0, 6).map(text).join(" | ")); continue; }
      await click(card);
      await sleep(400);
      const modal = doc.querySelector(".modal");
      if (!modal) { check(`detail [${name}]: detail opened`, false); continue; }
      const media = modal.querySelector(".movement-visual img");
      const note = text(modal.querySelector(".movement-media-note"));
      const status = text(modal.querySelector(".movement-controls span"));
      const shown = media ? media.getAttribute("src") : null;
      if (level === "exact") check(`detail [${name}]: shows ${img} as source illustration`, shown === img && status === "Illustration humaine · source", `shown=${shown} status=${status}`);
      if (level === "variante") check(`detail [${name}]: variant image ${img} with explicit difference note`, shown === img && /Même mouvement, détail différent/.test(status) && /^Démonstration : .+\. Illustration : /.test(note), `shown=${shown} status=${status} note=${note.slice(0, 140)}`);
      if (level === "none") check(`detail [${name}]: no substitute image, explicit absence text`, !shown && /Pas de démonstration correspondante pour cette variante : (Pas d|Aucun)/.test(note) && !modal.querySelector(".human-recovery-visual"), `shown=${shown} note=${note.slice(0, 140)}`);
      if (shown) check(`detail [${name}]: file exists`, exists(shown));
      const close = [...modal.querySelectorAll("button")].find((b) => text(b) === "Fermer" || b.getAttribute("aria-label") === "Fermer");
      if (close) await click(close);
      await sleep(200);
    }
  }
  check("library: no runtime errors", app.errors.length === 0, app.errors.join(" | ").slice(0, 400));
  await app.close();
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
fs.mkdirSync(path.join(root, ".cache"), { recursive: true });
fs.writeFileSync(path.join(root, ".cache/media-dom-smoke.json"), JSON.stringify(results, null, 1));
process.exit(failed.length ? 1 : 0);
