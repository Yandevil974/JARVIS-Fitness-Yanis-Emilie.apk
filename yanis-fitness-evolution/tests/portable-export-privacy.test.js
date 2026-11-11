import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState } from '../src/store/model.js';
import { exportPortable } from '../src/store/portable.js';

// Both real export branches are exercised through their download output.
test('HTML portable : les deux parcours retirent les clés sans altérer les profils', async () => {
  const state = initialState();
  state.profiles.elite.preferences.brain = { enabled: true, provider: 'groq', key: 'FAKE_SECRET_ELITE' };
  state.profiles.emilie.preferences.brain = { enabled: true, provider: 'openrouter', key: 'FAKE_SECRET_EMILIE' };
  state.profiles.elite.name = 'Athlète <test>';
  const before = structuredClone(state);
  const saved = { document: globalThis.document, fetch: globalThis.fetch, portable: globalThis.__JARVIS_PORTABLE__, create: URL.createObjectURL, revoke: URL.revokeObjectURL };
  let blob, preload, removed;
  try {
    URL.createObjectURL = b => { blob = b; return 'blob:test'; };
    URL.revokeObjectURL = () => {};
    const root = {
      querySelector(selector) {
        if (selector === '#root') return { innerHTML: 'private-rendered-view' };
        if (selector === '#jarvis-preload') return { remove() { removed = true; } };
        if (selector === 'head') return { appendChild(child) { preload = child.textContent; } };
      },
      get outerHTML() { return `<html><head><script id="jarvis-preload">${preload}</script></head><body></body></html>`; },
    };
    globalThis.document = {
      documentElement: { cloneNode() { return root; } },
      createElement(tag) { return tag === 'script' ? {} : { click() {}, remove() {} }; },
      body: { append() {} },
    };
    for (const portable of [false, true]) {
      globalThis.__JARVIS_PORTABLE__ = portable;
      globalThis.fetch = async url => {
        if (url === '/runtime.js') return { ok: true, text: async () => 'console.log("portable")' };
        if (url === '/runtime.css') return { ok: true, text: async () => 'body{}' };
        if (url === '/media-index.json') return { ok: true, json: async () => [] };
        throw new Error(`Unexpected asset: ${url}`);
      };
      blob = null;
      await exportPortable(state);
      assert.ok(blob, 'HTML download created');
      const html = await blob.text();
      assert.doesNotMatch(html, /FAKE_SECRET_ELITE|FAKE_SECRET_EMILIE/);
      const match = html.match(/globalThis\.__JARVIS_PRELOAD__=(.*?);<\/script>/s);
      assert.ok(match, 'serialized preload exists');
      const copy = JSON.parse(match[1]);
      assert.equal(copy.profiles.elite.preferences.brain.key, undefined);
      assert.equal(copy.profiles.emilie.preferences.brain.key, undefined);
      assert.equal(copy.profiles.elite.preferences.brain.provider, 'groq');
      assert.equal(copy.profiles.emilie.preferences.brain.provider, 'openrouter');
      assert.equal(copy.profiles.elite.name, 'Athlète <test>');
      assert.ok(!match[1].includes('<'), 'HTML script data is escaped');
      if (portable) assert.equal(removed, true, 'old preload removed before replacement');
    }
    assert.deepEqual(state, before);
  } finally {
    globalThis.document = saved.document; globalThis.fetch = saved.fetch;
    globalThis.__JARVIS_PORTABLE__ = saved.portable;
    URL.createObjectURL = saved.create; URL.revokeObjectURL = saved.revoke;
  }
});
