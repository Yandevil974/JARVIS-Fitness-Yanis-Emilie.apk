import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { parse } from "../../../JARVIS-Fitness-Source/node_modules/acorn/dist/acorn.mjs";
import { baseline, integrate } from "../build.mjs";
import { sha256 } from "../../../complete-hotfix/patch-web.mjs";
const relative = baseline.bundle.replace("assets/public/", "");
const original = fs.readFileSync(".cache/home-reference/" + relative, "utf8");
const candidate = fs.readFileSync(".cache/home-web/" + relative, "utf8");
function declarations(text) {
  return new Map(
    parse(text, { ecmaVersion: "latest", sourceType: "module" })
      .body.map((n) => [
        n.id?.name || n.declarations?.map((d) => d.id.name).join(","),
        text.slice(n.start, n.end),
      ])
      .filter(([key]) => key),
  );
}
test("only the home composition and its mobile navigation change; all seven engines/observers remain byte-identical", () => {
  const a = declarations(original),
    b = declarations(candidate),
    changes = [];
  for (const [name, code] of a) {
    assert.ok(b.has(name), name);
    if (b.get(name) !== code) changes.push(name);
  }
  assert.deepEqual(changes.sort(), ["I3", "t2"]);
  for (const name of [
    "JarvisVoice",
    "JarvisVoiceModule",
    "JarvisSpokesperson",
    "JarvisSpokespersonModule",
    "JarvisAppointments",
    "JarvisAppointmentsModule",
    "JarvisAdaptation",
    "JarvisDecisions",
    "JarvisNotifications",
    "JarvisFollowUp",
    "b5",
    "v5",
    "El",
    "Q5",
    "Mx",
  ])
    assert.equal(a.get(name), b.get(name), name);
});
test("all existing home labels and data expressions are retained, photo and launch callbacks included", () => {
  const a = declarations(original).get("t2"),
    b = declarations(candidate).get("t2");
  const literals = (text) => {
    const out = [];
    function walk(n) {
      if (!n || typeof n !== "object") return;
      if (n.type === "Literal") out.push(JSON.stringify(n.value));
      for (const v of Object.values(n))
        if (Array.isArray(v)) v.forEach(walk);
        else if (v && typeof v === "object") walk(v);
    }
    walk(parse(text, { ecmaVersion: "latest" }));
    return out.sort();
  };
  assert.deepEqual(literals(a), literals(b));
  const start = a.indexOf('s.jsxs("section",{className:"training-hero"'),
    end = a.indexOf(",s.jsx(Wh,{}", start);
  assert.ok(b.includes(a.slice(start, end)), "exact original hero retained");
  assert.equal((b.match(/className:"training-hero"/g) || []).length, 1);
});
test("web inventory: same 272 files, only the bundle changes, including original image bytes", () => {
  const dir = ".cache/home-reference",
    out = ".cache/home-web";
  const list = (p) =>
    fs
      .readdirSync(p, { recursive: true })
      .filter((n) => fs.statSync(p + "/" + n).isFile())
      .sort();
  const files = list(dir);
  assert.equal(files.length, 272);
  assert.deepEqual(list(out), files);
  assert.deepEqual(
    files.filter(
      (n) =>
        sha256(fs.readFileSync(dir + "/" + n)) !==
        sha256(fs.readFileSync(out + "/" + n)),
    ),
    [relative],
  );
  assert.equal(sha256(fs.readFileSync(baseline.apk)), baseline.apkSha256);
});
test("integration is reproducible and rejects wrong or already integrated input", async () => {
  assert.equal(await integrate(original), candidate);
  await assert.rejects(() => integrate(original + " "));
  await assert.rejects(() => integrate(candidate));
});
