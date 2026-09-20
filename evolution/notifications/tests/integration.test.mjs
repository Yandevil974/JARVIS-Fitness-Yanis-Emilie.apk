import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { parse } from "../../../JARVIS-Fitness-Source/node_modules/acorn/dist/acorn.mjs";
import { config, sha256 } from "../../../complete-hotfix/patch-web.mjs";
import { integrate } from "../build.mjs";
const release = JSON.parse(
  fs.readFileSync(new URL("../../android/release-next.json", import.meta.url)),
);
const relative = config.bundle.path.replace("assets/public/", "");
const original = fs.readFileSync(
  ".cache/reference/" + config.bundle.path,
  "utf8",
);
const before = fs.readFileSync(".cache/decisions-web/" + relative, "utf8");
const after = fs
  .readFileSync(".cache/notifications-web/" + relative, "utf8")
  .replace("V " + release.version, "V 1.0.6");
function declarations(text) {
  const ast = parse(text, { ecmaVersion: "latest", sourceType: "module" });
  return new Map(
    ast.body
      .map((n) => [
        n.id?.name || n.declarations?.map((d) => d.id.name).join(","),
        text.slice(n.start, n.end),
      ])
      .filter(([k]) => k),
  );
}
test("step 7 changes only dashboard, observer, Android legacy emitter and explanatory footer", () => {
  const a = declarations(before),
    b = declarations(after),
    changed = [];
  for (const [name, text] of a) {
    assert.ok(b.has(name), name);
    if (b.get(name) !== text) changed.push(name);
  }
  assert.deepEqual(
    changed.sort(),
    ["I3", "JarvisFollowUpModule", "T3", "nd", "t2"].sort(),
  );
  for (const name of [
    "Yg",
    "Rg",
    "Qg",
    "P4",
    "b5",
    "_5",
    "ho",
    "JarvisDecisions",
    "JarvisAppointments",
    "JarvisSpokesperson",
    "JarvisVoice",
  ])
    assert.equal(a.get(name), b.get(name), name);
  assert.ok(b.get("nd").includes("Vs()||!l||!vo()"));
  assert.ok(after.includes("JarvisReminders"));
});
test("complete web inventory preserved and no personal JSON introduced", () => {
  const list = (path) =>
    fs
      .readdirSync(path, { recursive: true })
      .filter((n) => fs.statSync(path + "/" + n).isFile())
      .sort();
  const base = ".cache/reference/assets/public",
    next = ".cache/notifications-web";
  const files = list(base);
  assert.equal(files.length, 272);
  assert.deepEqual(list(next), files);
  assert.deepEqual(
    files.filter(
      (n) =>
        sha256(fs.readFileSync(base + "/" + n)) !==
        sha256(fs.readFileSync(next + "/" + n)),
    ),
    [relative],
  );
});
test("deterministic pinned full-app build rejects wrong inputs and matches signed release web", async () => {
  assert.equal(sha256(after), release.webSha256);
  assert.equal(await integrate(original), after);
  await assert.rejects(
    () => integrate(original + " "),
    /Unexpected APK bundle/,
  );
});
