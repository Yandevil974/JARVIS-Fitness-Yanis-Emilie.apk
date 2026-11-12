import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

test("Aperçu visuels est retiré du menu, mais sa page et les médias restent présents", () => {
  const app = readFileSync("src/App.jsx", "utf8");
  const nav = app.match(/const NAV = \[([\s\S]*?)\n\];/)?.[1];
  assert.ok(nav, "configuration du menu introuvable");
  assert.doesNotMatch(nav, /["']apercu["']/);
  assert.match(nav, /["']training["']/);
  assert.match(app, /apercu:\s*Apercu/);
  assert.ok(existsSync("src/pages/Apercu.jsx"));
  assert.ok(existsSync("public/apercu/19.webp"));
});
