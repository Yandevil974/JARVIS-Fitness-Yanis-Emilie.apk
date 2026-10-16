import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { STRETCH_IMAGES } from "../src/data/visuals.js";

const root = path.resolve(".");

test("module 2 lot 1: three distinct, present animated GIFs are mapped", () => {
  const exercises = [
    "Étirement dans l'encadrement de porte",
    "Bras tendu contre le mur",
    "Position de l'enfant (Balasana)",
  ];
  const paths = exercises.map((name) => STRETCH_IMAGES[name]);
  assert.equal(new Set(paths).size, 3, "chaque exercice doit avoir son GIF propre");
  assert.equal(
    STRETCH_IMAGES["Position de l'enfant"],
    STRETCH_IMAGES["Position de l'enfant (Balasana)"],
    "l'alias du même exercice conserve son GIF propre",
  );

  for (const src of paths) {
    const relative = src.replace(/^\//, "");
    const file = path.join(root, "public", relative);
    assert.ok(fs.existsSync(file), `${src} doit exister dans public`);
    const bytes = fs.readFileSync(file);
    assert.ok(bytes.subarray(0, 6).toString("ascii").startsWith("GIF8"));
    const digest = crypto.createHash("sha256").update(bytes).digest("hex");
    assert.equal(path.basename(file, ".gif"), digest.slice(0, 16));
    assert.ok(fs.existsSync(path.join(root, "release", relative)));
    assert.ok(fs.existsSync(path.join(root, "release", "media", path.basename(file))));
  }
});
