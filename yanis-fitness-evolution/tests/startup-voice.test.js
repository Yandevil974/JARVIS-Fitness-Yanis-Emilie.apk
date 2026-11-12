import test from "node:test";
import assert from "node:assert/strict";
import { initialState, newProfile, validateState } from "../src/store/model.js";
import {
  startupVoiceEnabled,
  startupVoiceMessage,
  startupVoiceLifecycle,
} from "../src/engine/startup-voice.js";

test("respecte le coach vocal et des choix séparés pour chaque profil", () => {
  const yanis = newProfile("elite"),
    emilie = newProfile("emilie");
  assert.equal(startupVoiceEnabled(yanis), false);
  yanis.preferences.voice = true;
  emilie.preferences.voice = true;
  assert.equal(startupVoiceEnabled(yanis), true);
  assert.equal(startupVoiceEnabled(emilie), false);
  yanis.preferences.startupVoice = false;
  emilie.preferences.startupVoice = true;
  assert.equal(startupVoiceEnabled(yanis), false);
  assert.equal(startupVoiceEnabled(emilie), true);
  emilie.preferences.voice = false;
  assert.equal(startupVoiceEnabled(emilie), false);
  const state = initialState();
  state.profiles.elite.preferences.startupVoice = false;
  state.profiles.emilie.preferences.startupVoice = true;
  const restored = validateState(state);
  assert.equal(restored.profiles.elite.preferences.startupVoice, false);
  assert.equal(restored.profiles.emilie.preferences.startupVoice, true);
});

test("bonjour et résumé des événements et rappels dus sans inventer de séance", () => {
  const p = newProfile("elite");
  p.user.name = "Yanis";
  p.plan = null;
  p.preferences.dailyReminders = {
    checkin: { date: "2026-10-10" },
    review: { date: "" },
  };
  const message = startupVoiceMessage(p, "2026-10-11");
  assert.match(message, /Bonjour Yanis, JARVIS est prêt/);
  assert.match(message, /Aucun calendrier actif : journée à vérifier/);
  assert.match(message, /Bilan de récupération/);
  p.checkIns["2026-10-11"] = {};
  assert.doesNotMatch(
    startupVoiceMessage(p, "2026-10-11"),
    /À prévoir : Bilan/,
  );
});

test("pas d'annonce avant chargement ou en arrière-plan ; une annonce par retour", () => {
  let count = 0;
  const c = startupVoiceLifecycle(() => count++, false);
  c.setActive(false);
  c.start();
  c.start();
  assert.equal(count, 0);
  c.setActive(true);
  c.setActive(true);
  c.start();
  assert.equal(count, 1);
  c.setActive(false);
  c.setActive(false);
  assert.equal(count, 1);
  c.setActive(true);
  assert.equal(count, 2);
});
