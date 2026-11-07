import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { STRETCH_IMAGES } from "../src/data/visuals.js";
import { GIF_STEPS, STRETCH_KEY_BY_NAME, stepGif } from "../src/data/visuals-gifs.js";
import { RECOVERY_EXERCISES } from "../src/data/library.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lot1 = [
  ["Étirement dans l'encadrement de porte", "/media/a78693d8a7586ec3.gif"],
  ["Bras tendu contre le mur", "/media/31036c76962c0fd8.gif"],
  ["Position de l'enfant (Balasana)", "/media/ca55d85fe63748ff.gif"],
];

test("Lot 1: approved stretch GIFs resolve in app, release, and media indexes", () => {
  const publicIndex = JSON.parse(
    fs.readFileSync(path.join(root, "public/media-index.json"), "utf8"),
  );
  const releaseIndex = JSON.parse(
    fs.readFileSync(path.join(root, "release/media-index.json"), "utf8"),
  );
  assert.deepEqual(publicIndex, [...publicIndex].sort());
  assert.deepEqual(releaseIndex, publicIndex);

  for (const [exercise, url] of lot1) {
    assert.equal(STRETCH_IMAGES[exercise], url);
    const key = STRETCH_KEY_BY_NAME[exercise];
    assert.ok(key, `${exercise} has an animation key`);
    assert.equal(stepGif(key, "elite"), url);
    assert.equal(stepGif(key, "emilie"), url);
    assert.equal(GIF_STEPS[key].homme, url);
    const recoveryEntries = RECOVERY_EXERCISES.filter(
      (entry) => entry.name === exercise,
    );
    assert.ok(recoveryEntries.length > 0, `${exercise} exists in recovery exercises`);
    assert.ok(recoveryEntries.every((entry) => entry.img === url));
    assert.ok(recoveryEntries.every((entry) => entry.img_homme === url));
    assert.ok(publicIndex.includes(url), `${url} is listed for portable export`);

    const filename = path.basename(url);
    const publicGif = fs.readFileSync(path.join(root, "public", url.slice(1)));
    const releaseGif = fs.readFileSync(path.join(root, "release", url.slice(1)));
    assert.deepEqual(releaseGif, publicGif);
    assert.equal(publicGif.subarray(0, 6).toString("ascii"), "GIF89a");
    assert.equal(crypto.createHash("sha256").update(publicGif).digest("hex").slice(0, 16),
      filename.slice(0, 16));
  }

  assert.equal(
    STRETCH_IMAGES["Position de l'enfant"],
    STRETCH_IMAGES["Position de l'enfant (Balasana)"],
    "the Balasana alias is the same exercise, not a shared animation between different exercises",
  );
});
