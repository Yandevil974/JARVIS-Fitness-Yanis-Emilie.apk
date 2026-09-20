import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { parse } from "../../../JARVIS-Fitness-Source/node_modules/acorn/dist/acorn.mjs";
import { integrate } from "../build.mjs";
import { integrate as voice } from "../../adaptation/build.mjs";
import { config, sha256 } from "../../../complete-hotfix/patch-web.mjs";
const apk = path.resolve(".cache/reference/base.apk");
const original = execFileSync(
  "python3",
  [
    "-c",
    "import zipfile,sys;sys.stdout.buffer.write(zipfile.ZipFile(sys.argv[1]).read(sys.argv[2]))",
    apk,
    config.bundle.path,
  ],
  { maxBuffer: 8 * 1024 * 1024 },
).toString();
const before = await voice(original),
  after = await integrate(original);
function declarations(text) {
  return new Map(
    parse(text, { ecmaVersion: "latest", sourceType: "module" }).body.flatMap(
      (n) => {
        const names =
          n.type === "FunctionDeclaration"
            ? [n.id.name]
            : n.type === "VariableDeclaration"
              ? n.declarations.map((d) => d.id?.name).filter(Boolean)
              : [];
        return names.map((name) => [name, text.slice(n.start, n.end)]);
      },
    ),
  );
}
test("stage 6 conserves every previous declaration except the decision slot, modal route and approved-load override", () => {
  const next = declarations(after),
    changed = [];
  for (const [name, text] of declarations(before)) {
    assert.ok(next.has(name), name);
    if (next.get(name) !== text) changed.push(name);
  }
  assert.deepEqual(changed.sort(), ["JarvisAdaptation", "Q5", "ho"]);
  const originalLoad = declarations(before).get("ho"),
    prefix = "function ho(i,o,n=P()){";
  assert.ok(
    next
      .get("ho")
      .includes(
        "const original=(()=>{" +
          originalLoad.slice(prefix.length, -1) +
          "})();",
      ),
    "entire legacy recommendation body preserved",
  );
  assert.ok(next.has("JarvisSpokesperson"));
  assert.ok(next.has("JarvisVoice"));
  assert.ok(next.has("JarvisFollowUp"));
});
test("all complete screens, local team metadata, timers and store are byte-identical to stage 5", () => {
  const a = declarations(before),
    b = declarations(after);
  for (const name of [
    "P4",
    "Rg",
    "Sg",
    "Qg",
    "N5",
    "G3",
    "I3",
    "Yg",
    "Gs",
    "b5",
    "Ut",
    "_5",
    "T5",
    "We",
    "oo",
  ]) {
    assert.ok(a.has(name), name);
    assert.equal(b.get(name), a.get(name), name);
  }
});
test("building is deterministic and rejects an unknown reference APK", async () => {
  assert.equal(sha256(await integrate(original)), sha256(after));
  await assert.rejects(
    () => integrate(original + "\n"),
    /Unexpected APK bundle/,
  );
});
