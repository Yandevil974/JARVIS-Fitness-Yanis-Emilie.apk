import { test } from "node:test";
import assert from "node:assert/strict";
import { compatiblePhotos, previousComparable, photoConfig, comparePhotos, parsePhotoAnalysis, PHOTO_MODEL } from "../src/engine/photo-comparison-ai.js";
const image = "data:image/jpeg;base64,YWJj";
const before = { id: "old", date: "2026-01-01", view: "face", data: image };
const after = { id: "new", date: "2026-02-01", view: "face", data: image };
const profile = { preferences: { brain: { enabled: true, provider: "groq", key: "test-only-key-not-real" } } };
const result = { comparabilite: "limitee", limites: "Pose et lumière différentes.", zones: [{ zone: "epaules", observation: "Les contours semblent légèrement différents." }] };

test("sélectionne la dernière photo réelle antérieure, même vue et date vérifiée", () => {
  assert.equal(compatiblePhotos(before, after), true);
  for (const bad of [{ ...before, simulated: true }, { ...before, view: "dos" }, { ...before, date: after.date }, { ...before, needsDate: true }, { ...before, data: "/media/x.gif" }, { ...before, date: "2026-02-30" }]) assert.equal(compatiblePhotos(bad, after), false);
  const newer = { ...before, id: "recent", date: "2026-01-20" };
  assert.equal(previousComparable([before, newer, { ...newer, id: "sim", simulated: true }], after).id, "recent");
  assert.equal(previousComparable([], after), null);
});

test("un seul appel Groq vision avec deux photos et sans repli OpenRouter", async () => {
  let calls = 0;
  const fetchImpl = async (url, req) => {
    calls++;
    assert.equal(url, "https://api.groq.com/openai/v1/chat/completions");
    const body = JSON.parse(req.body);
    assert.equal(body.model, PHOTO_MODEL);
    assert.equal(body.stream, false);
    assert.deepEqual(body.messages[1].content.filter(x => x.type === "image_url").map(x => x.image_url.url), [image, image]);
    return { ok: true, json: async () => ({ choices: [{ message: { content: JSON.stringify(result) } }] }) };
  };
  assert.deepEqual(await comparePhotos({ profile, before, after, fetchImpl }), result);
  assert.equal(calls, 1);
  assert.equal(photoConfig({ preferences: { brain: { ...profile.preferences.brain, provider: "openrouter" } } }), null);
  await assert.rejects(comparePhotos({ profile: {}, before, after, fetchImpl }), /Activez Groq/);
  await assert.rejects(comparePhotos({ profile, before: after, after: before, fetchImpl }), /Choisissez/);
  assert.equal(calls, 1);
});

test("rejette les réponses invalides, chiffres corporels et diagnostics", () => {
  assert.deepEqual(parsePhotoAnalysis(JSON.stringify(result)), result);
  for (const value of ["pas du JSON", JSON.stringify({ ...result, zones: [{ zone: "ventre", observation: "test" }] }), JSON.stringify({ ...result, limites: "12 % de gras" }), JSON.stringify({ ...result, zones: [{ zone: "bras", observation: "Prise de masse musculaire" }] }), JSON.stringify({ ...result, comparabilite: "impossible" })]) assert.throws(() => parsePhotoAnalysis(value));
});

test("erreur réseau sans reprise payante ni divulgation de la réponse brute", async () => {
  let calls = 0;
  await assert.rejects(comparePhotos({ profile, before, after, fetchImpl: async () => { calls++; return { ok: false, status: 429 }; } }), /code 429/);
  assert.equal(calls, 1);
});
