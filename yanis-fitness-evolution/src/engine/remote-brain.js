/* Connecteur conversationnel ARENA//X — réplique du moteur d'appels de la
   plate-forme IA de l'utilisateur (ai-arena/index.html) : endpoints OpenAI
   compatibles Groq / OpenRouter, streaming SSE, modes solo et collaboration
   (brouillons parallèles + synthétiseur), catalogue gratuit de secours.
   Aucune dépendance. Le cerveau local reste le secours hors ligne. */

export const ARENA_ENDPOINTS = {
  groq: "https://api.groq.com/openai/v1",
  openrouter: "https://openrouter.ai/api/v1",
};

/* Catalogue gratuit de secours, identique à celui de l'arène. */
export const ARENA_FREE_MODELS = {
  groq: ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b"],
  openrouter: [
    "openrouter/free",
    "openai/gpt-oss-120b:free",
    "google/gemma-4-31b-it:free",
  ],
};

export const JARVIS_SYSTEM =
  "Tu es JARVIS, le coach conversationnel de l'application Yanis Fitness Évolution. " +
  "Réponds toujours en français, avec chaleur, simplicité et esprit pratique : " +
  "phrases courtes, conseils actionnables, encouragement sincère. " +
  "Tu maîtrises entraînement, récupération, nutrition et motivation, mais tu peux " +
  "aussi discuter de tout autre sujet si l'utilisateur le souhaite. " +
  "Ne mentionne jamais les modèles, les brouillons ni le processus technique : " +
  "parle comme un coach présent, pas comme un système.";

/* Prompt du synthétiseur repris tel quel de l'arène, précédé du rappel de rôle. */
export const ARENA_SYNTH_SYSTEM =
  JARVIS_SYSTEM +
  " Tu es aussi le synthétiseur d'une arène d'IA. À partir de plusieurs brouillons, " +
  "tu produis LA meilleure réponse finale : tu vérifies les faits, corriges les " +
  "erreurs, élimines les redites, gardes les points forts de chaque brouillon et tu " +
  "rédiges une réponse claire, complète et bien structurée. Ne mentionne jamais les " +
  "brouillons, les modèles ni le processus : donne directement la réponse.";

export function brainConfig(p) {
  const b = p?.preferences?.brain || {};
  return {
    enabled: !!b.enabled,
    provider: b.provider === "openrouter" ? "openrouter" : "groq",
    key: String(b.key || ""),
    style: b.style === "collab" ? "collab" : "solo",
    model: typeof b.model === "string" && b.model ? b.model : null,
  };
}

export function brainReady(cfg) {
  return !!cfg && cfg.enabled && cfg.key.trim().length > 10;
}

export function brainModels(cfg) {
  if (cfg.model) return [cfg.model];
  const list = ARENA_FREE_MODELS[cfg.provider] || ARENA_FREE_MODELS.groq;
  return cfg.style === "collab" ? list.slice(0, 2) : list.slice(0, 1);
}

export function buildRequest(cfg, modelId, messages, stream = true) {
  const base = ARENA_ENDPOINTS[cfg.provider] || ARENA_ENDPOINTS.groq;
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + cfg.key,
  };
  if (cfg.provider === "openrouter") headers["X-Title"] = "JARVIS Fitness";
  const body = { model: modelId, messages, stream };
  if (stream) body.stream_options = { include_usage: true };
  return { url: base + "/chat/completions", headers, body };
}

/* Analyse une ligne SSE : { delta, done } ou null si ligne inutile. */
export function parseSSELine(line) {
  if (!line) return null;
  const t = String(line).trim();
  if (!t.startsWith("data:")) return null;
  const payload = t.slice(5).trim();
  if (!payload) return null;
  if (payload === "[DONE]") return { delta: "", done: true };
  try {
    const json = JSON.parse(payload);
    const choice = json.choices && json.choices[0];
    const delta =
      (choice && choice.delta && choice.delta.content) ||
      (choice && choice.message && choice.message.content) ||
      "";
    return { delta: String(delta), done: false };
  } catch {
    return null;
  }
}

export function conversationMessages(history, userText, context = null) {
  const past = (Array.isArray(history) ? history : [])
    .filter((m) => m && m.text && (m.role === "user" || m.role === "assistant"))
    .slice(-12)
    .map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: String(m.text).slice(0, 800),
    }));
  const out = [{ role: "system", content: JARVIS_SYSTEM }];
  if (context && String(context).trim())
    out.push({ role: "system", content: String(context).trim() });
  out.push(...past, { role: "user", content: String(userText).slice(0, 1500) });
  return out;
}

async function postOnce(cfg, modelId, messages, stream, signal) {
  let req = buildRequest(cfg, modelId, messages, stream);
  let res = await fetch(req.url, {
    method: "POST",
    headers: req.headers,
    body: JSON.stringify(req.body),
    signal,
  });
  if (res.status === 400) {
    /* Certains modèles refusent stream_options / temperature : repli. */
    const body2 = { ...req.body };
    delete body2.stream_options;
    res = await fetch(req.url, {
      method: "POST",
      headers: req.headers,
      body: JSON.stringify(body2),
      signal,
    });
  }
  if (!res.ok) {
    let detail = "";
    try {
      detail = (await res.text()).slice(0, 140);
    } catch {}
    throw new Error("HTTP " + res.status + (detail ? " — " + detail : ""));
  }
  return res;
}

async function streamOnce(cfg, modelId, messages, signal, onDelta) {
  const res = await postOnce(cfg, modelId, messages, true, signal);
  const reader = res.body && res.body.getReader ? res.body.getReader() : null;
  if (!reader) {
    const json = await res.json();
    const text = json.choices?.[0]?.message?.content || "";
    if (onDelta) onDelta(text, text);
    return text;
  }
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      const parsed = parseSSELine(line);
      if (!parsed) continue;
      if (parsed.done) return full;
      if (parsed.delta) {
        full += parsed.delta;
        if (onDelta) onDelta(full, parsed.delta);
      }
    }
  }
  return full;
}

async function draftOnce(cfg, modelId, messages, signal) {
  const res = await postOnce(cfg, modelId, messages, false, signal);
  const json = await res.json();
  return json.choices?.[0]?.message?.content || "";
}

/* Validation de clé : ping minimal (quelques jetons) sur le premier modèle
   du catalogue actif. 200 = clé + modèle opérationnels. */
export async function testArenaKey(cfg) {
  const model = brainModels(cfg)[0];
  const res = await postOnce(cfg, model, [{ role: "user", content: "ping" }], false);
  const json = await res.json().catch(() => ({}));
  const content =
    (json.choices && json.choices[0] &&
      (json.choices[0].message && json.choices[0].message.content)) ||
    (json.choices && json.choices[0].text) ||
    "";
  return { ok: true, model, reply: String(content).slice(0, 120) };
}

/* Point d'entrée : conversation via la plate-forme ARENA//X de l'utilisateur.
   Renvoie le texte final ; onDelta(full, chunk) est appelé pendant le flux. */
export async function askArena(cfg, history, userText, opts = {}) {
  const { signal = null, onDelta = null, context = null } = opts;
  const models = brainModels(cfg);
  const messages = conversationMessages(history, userText, context);
  if (cfg.style !== "collab" || models.length < 2) {
    const text = await streamOnce(cfg, models[0], messages, signal, onDelta);
    if (!text.trim()) throw new Error("réponse vide");
    return text;
  }
  const results = await Promise.allSettled(
    models.map((m) => draftOnce(cfg, m, messages, signal)),
  );
  const drafts = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value)
    .filter((t) => t && t.trim());
  if (!drafts.length) {
    const reason = results[0]?.reason;
    throw new Error(reason?.message || "aucun brouillon reçu");
  }
  if (drafts.length === 1) return drafts[0];
  const synthMessages = [
    { role: "system", content: ARENA_SYNTH_SYSTEM },
    {
      role: "user",
      content:
        "Question : " +
        String(userText).slice(0, 1500) +
        "\n\nBrouillons :\n" +
        drafts.map((d, i) => "--- Brouillon " + (i + 1) + " ---\n" + d).join("\n"),
    },
  ];
  const text = await streamOnce(
    cfg,
    models[0],
    synthMessages,
    signal,
    onDelta,
  );
  if (!text.trim()) throw new Error("synthèse vide");
  return text;
}
