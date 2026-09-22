import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseImport } from "../src/store/model.js";
import { validateState } from "../src/store/schema.js";
// Import réel des données utilisateur (DOC JSON, schemaVersion 3) : la nouvelle
// application doit adopter l'historique complet sans jamais toucher à la source.
const DOC = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "DOC-20260919-WA0000..json",
);
test("DOC-20260919-WA0000.json s'importe intact dans le nouveau schéma", { skip: !fs.existsSync(DOC) }, () => {
  const state = validateState(parseImport(fs.readFileSync(DOC, "utf8")));
  assert.equal(state.schemaVersion, 3);
  assert.equal(state.activeProfile, "elite");
  const elite = state.profiles.elite;
  const emilie = state.profiles.emilie;
  assert.ok(elite, "profil Yanis présent");
  assert.equal(elite.user.name, "Yanis");
  assert.equal(elite.sessions.length, 18);
  assert.equal(elite.photos.length, 8);
  assert.equal(elite.measurements.length, 11);
  // Aucun identifiant en double, aucune séance sans date valide.
  const ids = new Set(elite.sessions.map((s) => s.id));
  assert.equal(ids.size, elite.sessions.length);
  for (const s of elite.sessions) assert.match(s.date, /^\d{4}-\d{2}-\d{2}$/);
  // Le profil Émilie reste une destination séparée et vide d'historique.
  assert.equal(emilie.sessions.length, 0);
});
test("la sauvegarde exportée se relit à l'identique (idempotence)", { skip: !fs.existsSync(DOC) }, () => {
  const state = validateState(parseImport(fs.readFileSync(DOC, "utf8")));
  const again = validateState(JSON.parse(JSON.stringify(state)));
  assert.deepEqual(again, state);
});
