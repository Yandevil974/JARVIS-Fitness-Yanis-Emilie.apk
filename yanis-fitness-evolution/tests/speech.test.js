import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_SPEECH_RATE,
  normalizeSpeechRate,
} from "../src/engine/speech.js";
import { initialState, validateState } from "../src/store/model.js";

test("Speech rate uses a safe shared default and bounds", () => {
  assert.equal(DEFAULT_SPEECH_RATE, 1);
  assert.equal(normalizeSpeechRate(undefined), 1);
  assert.equal(normalizeSpeechRate("1.25"), 1.25);
  assert.equal(normalizeSpeechRate(0.1), 0.5);
  assert.equal(normalizeSpeechRate(4), 2);
  assert.equal(normalizeSpeechRate("not-a-number"), 1);
});

test("Speech rate is persisted and older profiles receive the default", () => {
  const state = initialState();
  state.profiles.elite.preferences.speechRate = 1.35;
  const checked = validateState(state);
  assert.equal(checked.profiles.elite.preferences.speechRate, 1.35);
  delete state.profiles.emilie.preferences.speechRate;
  const migrated = validateState(state);
  assert.equal(migrated.profiles.emilie.preferences.speechRate, 1);
});
