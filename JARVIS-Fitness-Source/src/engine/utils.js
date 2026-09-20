import { isAndroid, nativeExport } from "../platform/native.js";
export const SCHEMA_VERSION = 3;
export const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
export const round = (n, p = 1) =>
  Number.isFinite(n)
    ? Math.round((n + Number.EPSILON) * 10 ** p) / 10 ** p
    : null;
export function num(v) {
  if (v == null || String(v).trim() === "") return null;
  const n = Number(String(v).trim().replace(",", "."));
  return Number.isFinite(n) ? n : null;
}
export const norm = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, " ")
    .replace(/[-–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
export const slug = (s) =>
  norm(s)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export const uid = () =>
  globalThis.crypto?.randomUUID?.() ??
  `j-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
export function dateKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export const today = () => dateKey();
export function parseDate(s) {
  return new Date(`${String(s).slice(0, 10)}T12:00:00`);
}
export function addDays(s, n) {
  const d = typeof s === "string" ? parseDate(s) : new Date(s);
  d.setDate(d.getDate() + n);
  return dateKey(d);
}
export function dayDiff(a, b) {
  return Math.round((parseDate(a) - parseDate(b)) / 864e5);
}
export function monday(s = today()) {
  const d = parseDate(s);
  return addDays(s, -((d.getDay() + 6) % 7));
}
export const dateLabel = (s, opts = { day: "numeric", month: "short" }) =>
  s ? parseDate(s).toLocaleDateString("fr-FR", opts) : "—";
export const numberLabel = (n, d = 1) =>
  n == null || !Number.isFinite(+n)
    ? "—"
    : new Intl.NumberFormat("fr-FR", { maximumFractionDigits: d }).format(+n);
export const durationLabel = (s) =>
  `${String(Math.floor(Math.max(0, s) / 60)).padStart(2, "0")}:${String(Math.floor(Math.max(0, s) % 60)).padStart(2, "0")}`;
export const avg = (a) =>
  a.length ? a.reduce((s, n) => s + n, 0) / a.length : null;
export const sum = (a) =>
  a.reduce((s, n) => s + (Number.isFinite(n) ? n : 0), 0);
export const pctChange = (a, b) =>
  a != null && a > 0 && b != null ? round(((b - a) / a) * 100) : null;
export const assetSrc = (p) => globalThis.__JARVIS_ASSETS__?.[p] ?? p;
export const textOnly = (s) =>
  String(s || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/^[💡🏋️🍑]\s*/u, "");
export function download(name, content, type = "application/json") {
  if (isAndroid())
    return nativeExport(name, content).catch((error) => {
      window.dispatchEvent(
        new CustomEvent("jarvis-export-error", {
          detail: error.message || "Export annulé.",
        }),
      );
      throw error;
    });
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
export function safeJSON(text) {
  if (text.length > 40 * 1024 * 1024)
    throw new Error("Le fichier dépasse 40 Mo.");
  return JSON.parse(text, (k, v) => {
    if (["__proto__", "prototype", "constructor"].includes(k))
      throw new Error("Clé non autorisée dans la sauvegarde.");
    return v;
  });
}
export function inRange(d, start, end = today()) {
  return !!d && d >= start && d <= end;
}
export function rangeStart(range, end = today()) {
  if (range === "jour") return end;
  if (range === "semaine") return monday(end);
  if (range === "mois") return end.slice(0, 7) + "-01";
  if (range === "trimestre") {
    const d = parseDate(end);
    return `${d.getFullYear()}-${String(Math.floor(d.getMonth() / 3) * 3 + 1).padStart(2, "0")}-01`;
  }
  if (range === "année") return end.slice(0, 4) + "-01-01";
  return "1900-01-01";
}
