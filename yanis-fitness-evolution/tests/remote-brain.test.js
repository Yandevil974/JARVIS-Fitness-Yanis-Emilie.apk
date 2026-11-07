import test from "node:test";
import assert from "node:assert/strict";
import {
  ARENA_ENDPOINTS,
  ARENA_FREE_MODELS,
  brainConfig,
  brainReady,
  brainModels,
  buildRequest,
  parseSSELine,
  conversationMessages,
  askArena,
  testArenaKey,
} from "../src/engine/remote-brain.js";

function sseResponse(chunks) {
  const enc = new TextEncoder();
  const queue = chunks.map((c) => enc.encode(c));
  return {
    ok: true,
    status: 200,
    body: {
      getReader: () => ({
        read: async () =>
          queue.length
            ? { done: false, value: queue.shift() }
            : { done: true, value: undefined },
      }),
    },
  };
}

function jsonResponse(text) {
  return {
    ok: true,
    status: 200,
    json: async () => ({ choices: [{ message: { content: text } }] }),
  };
}

const SSE_HELLO = [
  'data: {"choices":[{"delta":{"content":"Bon"}}]}\n\n',
  'data: {"choices":[{"delta":{"content":"jour"}}]}\n\n',
  "data: [DONE]\n\n",
];

test("brainConfig : valeurs par défaut et normalisation", () => {
  const cfg = brainConfig({});
  assert.equal(cfg.enabled, false);
  assert.equal(cfg.provider, "groq");
  assert.equal(cfg.style, "solo");
  assert.equal(cfg.key, "");
  assert.equal(cfg.model, null);
  const cfg2 = brainConfig({
    preferences: { brain: { enabled: true, provider: "openrouter", style: "collab", key: "sk-or-x" } },
  });
  assert.deepEqual(
    { enabled: cfg2.enabled, provider: cfg2.provider, style: cfg2.style },
    { enabled: true, provider: "openrouter", style: "collab" },
  );
});

test("brainReady : exige activation et clé suffisante", () => {
  assert.equal(brainReady(brainConfig({})), false);
  assert.equal(
    brainReady(brainConfig({ preferences: { brain: { enabled: true, key: "court" } } })),
    false,
  );
  assert.equal(
    brainReady(brainConfig({ preferences: { brain: { enabled: true, key: "gsk-1234567890" } } })),
    true,
  );
});

test("brainModels : solo un modèle, collab deux, modèle forcé prioritaire", () => {
  const solo = brainModels({ provider: "groq", style: "solo", model: null });
  assert.equal(solo.length, 1);
  const collab = brainModels({ provider: "groq", style: "collab", model: null });
  assert.equal(collab.length, 2);
  assert.deepEqual(ARENA_FREE_MODELS.groq.slice(0, 2), collab);
  const forced = brainModels({ provider: "groq", style: "collab", model: "mon/modele" });
  assert.deepEqual(forced, ["mon/modele"]);
});

test("buildRequest : endpoint Groq, auth, stream_options", () => {
  const cfg = { provider: "groq", key: "gsk-abc" };
  const req = buildRequest(cfg, "openai/gpt-oss-120b", [{ role: "user", content: "salut" }]);
  assert.equal(req.url, ARENA_ENDPOINTS.groq + "/chat/completions");
  assert.equal(req.headers.Authorization, "Bearer gsk-abc");
  assert.equal(req.headers["X-Title"], undefined);
  assert.equal(req.body.stream, true);
  assert.deepEqual(req.body.stream_options, { include_usage: true });
});

test("buildRequest : OpenRouter ajoute X-Title", () => {
  const cfg = { provider: "openrouter", key: "sk-or-abc" };
  const req = buildRequest(cfg, "openrouter/free", [], false);
  assert.equal(req.headers["X-Title"], "JARVIS Fitness");
  assert.equal(req.body.stream, false);
  assert.equal(req.body.stream_options, undefined);
});

test("parseSSELine : delta, [DONE], lignes parasites", () => {
  assert.deepEqual(
    parseSSELine('data: {"choices":[{"delta":{"content":"ok"}}]}'),
    { delta: "ok", done: false },
  );
  assert.deepEqual(parseSSELine("data: [DONE]"), { delta: "", done: true });
  assert.equal(parseSSELine(": comment"), null);
  assert.equal(parseSSELine("data: {pas json"), null);
  assert.equal(parseSSELine(""), null);
});

test("conversationMessages : système JARVIS, historique borné et tronqué", () => {
  const history = Array.from({ length: 20 }, (_, i) => ({
    role: i % 2 ? "assistant" : "user",
    text: "m" + i + " ".repeat(900),
  }));
  const msgs = conversationMessages(history, "question");
  assert.equal(msgs[0].role, "system");
  assert.match(msgs[0].content, /JARVIS/);
  assert.equal(msgs.length, 1 + 12 + 1);
  assert.ok(msgs.slice(1, -1).every((m) => m.content.length <= 800));
  assert.equal(msgs.at(-1).content, "question");
});

test("askArena solo : streaming SSE accumulé et onDelta cumulatif", async () => {
  const calls = [];
  global.fetch = async (url, opts) => {
    calls.push({ url, opts });
    return sseResponse(SSE_HELLO);
  };
  const deltas = [];
  const cfg = { provider: "groq", key: "gsk-1234567890", style: "solo", model: null };
  const text = await askArena(cfg, [], "salut", {
    onDelta: (full) => deltas.push(full),
  });
  assert.equal(text, "Bonjour");
  assert.deepEqual(deltas, ["Bon", "Bonjour"]);
  assert.equal(calls.length, 1);
  const body = JSON.parse(calls[0].opts.body);
  assert.equal(body.stream, true);
  assert.equal(body.model, ARENA_FREE_MODELS.groq[0]);
  delete global.fetch;
});

test("askArena collab : deux brouillons sans stream puis synthèse streamée", async () => {
  const calls = [];
  global.fetch = async (url, opts) => {
    const body = JSON.parse(opts.body);
    calls.push(body);
    return body.stream ? sseResponse(SSE_HELLO) : jsonResponse("brouillon " + calls.length);
  };
  const cfg = { provider: "groq", key: "gsk-1234567890", style: "collab", model: null };
  const text = await askArena(cfg, [], "salut");
  assert.equal(text, "Bonjour");
  assert.equal(calls.length, 3);
  assert.equal(calls[0].stream, false);
  assert.equal(calls[1].stream, false);
  assert.equal(calls[2].stream, true);
  assert.match(calls[2].messages.at(-1).content, /Brouillon 1/);
  assert.match(calls[2].messages[0].content, /synthétiseur/);
  delete global.fetch;
});

test("askArena : repli automatique si HTTP 400 (stream_options retiré)", async () => {
  const bodies = [];
  let n = 0;
  global.fetch = async (url, opts) => {
    n += 1;
    bodies.push(JSON.parse(opts.body));
    if (n === 1) return { ok: false, status: 400, text: async () => "unsupported" };
    return sseResponse(SSE_HELLO);
  };
  const cfg = { provider: "groq", key: "gsk-1234567890", style: "solo", model: null };
  const text = await askArena(cfg, [], "salut");
  assert.equal(text, "Bonjour");
  assert.equal(bodies.length, 2);
  assert.ok(bodies[0].stream_options);
  assert.equal(bodies[1].stream_options, undefined);
  delete global.fetch;
});

test("askArena : erreur réseau remontée pour le secours local", async () => {
  global.fetch = async () => {
    throw new Error("network down");
  };
  const cfg = { provider: "groq", key: "gsk-1234567890", style: "solo", model: null };
  await assert.rejects(() => askArena(cfg, [], "salut"), /network down/);
  delete global.fetch;
});

test("testArenaKey : clé valide → 200 + modèle du catalogue", async () => {
  const cfg = { provider: "groq", key: "gsk-1234567890", style: "solo", model: null };
  global.fetch = async (url, opts) => {
    assert.match(url, /api\.groq\.com/);
    assert.equal(opts.headers.Authorization, "Bearer gsk-1234567890");
    assert.equal(JSON.parse(opts.body).stream, false);
    return jsonResponse("pong");
  };
  const r = await testArenaKey(cfg);
  assert.equal(r.ok, true);
  assert.equal(r.model, ARENA_FREE_MODELS.groq[0]);
  assert.equal(r.reply, "pong");
  delete global.fetch;
});

test("testArenaKey : clé refusée → rejet HTTP 401", async () => {
  const cfg = { provider: "openrouter", key: "sk-or-abc", style: "solo", model: null };
  global.fetch = async () => ({
    ok: false,
    status: 401,
    text: async () => "Invalid API key",
  });
  await assert.rejects(() => testArenaKey(cfg), /HTTP 401/);
  delete global.fetch;
});

test("testArenaKey : modèle custom utilisé en priorité", async () => {
  const cfg = {
    provider: "groq",
    key: "gsk-1234567890",
    style: "solo",
    model: "openai/gpt-oss-20b",
  };
  global.fetch = async () => jsonResponse("ok");
  const r = await testArenaKey(cfg);
  assert.equal(r.model, "openai/gpt-oss-20b");
  delete global.fetch;
});
