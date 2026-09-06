import {
  nativeSnapshots,
  persistNative,
  isAndroid,
} from "../platform/native.js";
import { generatePlan } from "../engine/planner.js";
import { archivePlan } from "../engine/plan-memory.js";
import { initialState, validateState, migrateLegacy } from "./model.js";
import { safeJSON, download, today } from "../engine/utils.js";
const KEY = "jarvis_fitness_v3";
let dbPromise,
  protectedStorage = false,
  recoveryCopies = [],
  lastStored = 0;
function openDB() {
  if (!globalThis.indexedDB)
    return Promise.reject(new Error("IndexedDB indisponible"));
  if (!dbPromise)
    dbPromise = new Promise((resolve, reject) => {
      let r;
      try {
        r = indexedDB.open("jarvis-fitness", 1);
      } catch (e) {
        reject(e);
        return;
      }
      r.onupgradeneeded = () => {
        if (!r.result.objectStoreNames.contains("state"))
          r.result.createObjectStore("state");
      };
      r.onsuccess = () => {
        r.result.onversionchange = () => {
          r.result.close();
          dbPromise = null;
        };
        resolve(r.result);
      };
      r.onerror = () => {
        dbPromise = null;
        reject(r.error);
      };
      r.onblocked = () =>
        reject(new Error("Stockage bloqué par un autre onglet."));
    });
  return dbPromise;
}
async function dbGet() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const r = db
      .transaction("state", "readonly")
      .objectStore("state")
      .get("root");
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}
async function dbPut(data, key = "root") {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("state", "readwrite");
    tx.objectStore("state").put(data, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error("Écriture interrompue."));
  });
}
export function isStorageProtected() {
  return protectedStorage;
}
export function exportRecoveryData() {
  download(
    `JARVIS-recuperation-originaux-${today()}.json`,
    JSON.stringify(
      {
        createdAt: Date.now(),
        notice:
          "Copies originales non modifiées. Ne pas exécuter leur contenu.",
        copies: recoveryCopies,
      },
      null,
      2,
    ),
  );
}
export function unlockStorage() {
  protectedStorage = false;
  lastStored = Date.now();
}
export async function loadState() {
  const candidates = [];
  recoveryCopies = [];
  protectedStorage = false;
  try {
    const data = await dbGet();
    if (data) candidates.push({ source: "IndexedDB", data });
  } catch (e) {}
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        candidates.push({ source: "localStorage", data: safeJSON(raw) });
      } catch (e) {
        recoveryCopies.push({ source: "localStorage", raw, error: e.message });
      }
    }
  } catch (e) {}
  if (globalThis.__JARVIS_PRELOAD__)
    candidates.push({
      source: "Fichier portable",
      data: globalThis.__JARVIS_PRELOAD__,
    });
  for (const c of await nativeSnapshots()) {
    try {
      candidates.push({ source: c.source, data: safeJSON(c.raw) });
    } catch (e) {
      recoveryCopies.push({ ...c, error: e.message });
    }
  }
  const valid = [];
  for (const c of candidates) {
    try {
      valid.push({ source: c.source, data: validateState(c.data) });
    } catch (e) {
      recoveryCopies.push({ ...c, error: e.message });
    }
  }
  let warning = "";
  if (recoveryCopies.length) {
    protectedStorage = true;
    warning =
      "Sauvegarde incompatible détectée : enregistrement automatique bloqué pour protéger les originaux. Ouvrez Profil → Données pour télécharger les copies et choisir la restauration.";
    const key = "quarantine-" + Date.now();
    try {
      await dbPut(recoveryCopies, key);
    } catch (e) {
      try {
        localStorage.setItem(KEY + "-" + key, JSON.stringify(recoveryCopies));
      } catch (e) {}
    }
  }
  valid.sort((a, b) => b.data.updatedAt - a.data.updatedAt);
  if (valid.length) {
    lastStored = valid[0].data.updatedAt;
    for (const [id, p] of Object.entries(valid[0].data.profiles)) {
      if (
        id === "elite" &&
        (!p.user.name || ["Élite", "Profil Yanis"].includes(p.user.name))
      )
        p.user.name = "Yanis";
      if (p.sourceProgramRevision !== 2) {
        archivePlan(p);
        p.plan = generatePlan(p, {
          source: "legacy",
          weeks: 52,
          frequency: p.user.frequency,
          startDate: today(),
        });
        p.sourceProgramRevision = 2;
      }
    }
    return { data: valid[0].data, warning, blocked: protectedStorage };
  }
  const fresh = initialState();
  for (const [id, key] of [
    ["elite", "tmx12_transform_v1"],
    ["emilie", "emilie_transformation_v1"],
  ]) {
    try {
      const text = localStorage.getItem(key);
      if (text) fresh.profiles[id] = migrateLegacy(safeJSON(text), id);
    } catch (e) {
      warning =
        warning ||
        "Un ancien export nécessite un import manuel. Sa clé d’origine reste intacte.";
    }
  }
  lastStored = 0;
  return { data: fresh, warning, blocked: protectedStorage };
}
let writeChain = Promise.resolve();
export function saveOnExit(data) {
  if (protectedStorage || !data) return;
  try {
    data = validateState(data);
    const before = localStorage.getItem(KEY);
    if (before) {
      let old;
      try {
        old = validateState(safeJSON(before));
      } catch (error) {
        protectedStorage = true;
        recoveryCopies.push({
          source: "localStorage modifié pendant la session",
          raw: before,
          error: error.message,
        });
        return;
      }
      if (old.updatedAt > lastStored && old.updatedAt !== data.updatedAt)
        return;
    }
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {}
}
export function saveState(data) {
  let candidate;
  try {
    candidate = validateState(data);
  } catch (error) {
    return Promise.resolve({
      ok: false,
      mode: "validation",
      error: "Enregistrement refusé : " + error.message,
    });
  }
  data = candidate;
  writeChain = writeChain
    .catch(() => {})
    .then(async () => {
      if (protectedStorage)
        return { ok: false, mode: "protection", blocked: true };
      let existing = null;
      const invalid = [];
      try {
        const value = await dbGet();
        if (value) {
          try {
            existing = validateState(value);
          } catch (error) {
            invalid.push({
              source: "IndexedDB modifié pendant la session",
              data: value,
              error: error.message,
            });
          }
        }
      } catch (error) {}
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
          try {
            const local = validateState(safeJSON(raw));
            if (!existing || local.updatedAt > existing.updatedAt)
              existing = local;
          } catch (error) {
            invalid.push({
              source: "localStorage modifié pendant la session",
              raw,
              error: error.message,
            });
          }
        }
      } catch (error) {}
      if (invalid.length) {
        protectedStorage = true;
        recoveryCopies.push(...invalid);
        try {
          await dbPut(invalid, "quarantine-" + Date.now());
        } catch (error) {}
        return {
          ok: false,
          mode: "protection",
          blocked: true,
          error:
            "Un autre contenu invalide a été détecté. Les originaux sont conservés ; l’écriture est bloquée.",
        };
      }
      if (
        existing &&
        existing.updatedAt > lastStored &&
        existing.updatedAt !== data.updatedAt
      ) {
        protectedStorage = true;
        recoveryCopies.push({
          source: "Autre onglet / version",
          data: existing,
        });
        return { ok: false, mode: "conflit", blocked: true };
      }
      let localOk = false,
        dbOk = false;
      try {
        localStorage.setItem(KEY, JSON.stringify(data));
        localOk = true;
      } catch (e) {}
      try {
        await dbPut(data);
        dbOk = true;
      } catch (e) {}
      const nativeOk = await persistNative(data);
      if (localOk || dbOk || nativeOk) lastStored = data.updatedAt;
      return {
        ok: localOk || dbOk || nativeOk,
        mode: nativeOk
          ? "Android · fichier privé"
          : dbOk
            ? "IndexedDB"
            : localOk
              ? "localStorage"
              : "mémoire",
      };
    });
  return writeChain;
}

export function exportState(data) {
  return download(
    `JARVIS-sauvegarde-${today()}.json`,
    JSON.stringify({ ...data, exportedAt: new Date().toISOString() }, null, 2),
  );
}
export function exportHTMLBackup(data) {
  const encoded = JSON.stringify(data).replace(/</g, "\\u003c");
  return download(
    `JARVIS-donnees-${today()}.html`,
    `<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Sauvegarde JARVIS</title><body style="background:#173452;color:#dbe5f5;font-family:system-ui;padding:40px;max-width:720px;margin:auto"><h1>JARVIS · Sauvegarde locale</h1><p>Deux profils indépendants. Export du ${new Date().toLocaleString("fr-FR")}.</p><p>Ce fichier est une sauvegarde de vos données, pas une nouvelle version de l’application. Importez-le dans JARVIS, rubrique Profil → Données.</p><button id="export" style="padding:15px;background:#87d0ff;border:0;border-radius:8px">Télécharger le JSON</button><script id="jarvis-backup" type="application/json">${encoded}</script><script>document.getElementById('export').onclick=function(){var t=document.getElementById('jarvis-backup').textContent;var u=URL.createObjectURL(new Blob([t],{type:'application/json'}));var a=document.createElement('a');a.href=u;a.download='JARVIS-sauvegarde.json';a.click();setTimeout(function(){URL.revokeObjectURL(u)},2000)};<\/script></body></html>`,
    "text/html",
  );
}
export async function storageDiagnostic() {
  const test = { id: "diagnostic", time: Date.now() };
  let local = false,
    indexed = false;
  try {
    localStorage.setItem("jarvis-test", JSON.stringify(test));
    local = !!localStorage.getItem("jarvis-test");
    localStorage.removeItem("jarvis-test");
  } catch (e) {}
  try {
    await openDB();
    indexed = true;
  } catch (e) {}
  return {
    localStorage: local,
    indexedDB: indexed,
    secure: globalThis.isSecureContext,
    voice: !!globalThis.speechSynthesis,
    micro: !!(
      globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition
    ),
  };
}
