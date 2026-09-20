// Minimal scheduling snapshot: no messages, names, photos, medical or workout payloads.
import { reminders, today, validDate, addDays } from "../reminders/engine.mjs";
const PROFILES = ["elite", "emilie"];
const rows = (value) => (Array.isArray(value) ? value : []);
export function timeMinute(value, fallback = 1080) {
  if (value == null || value === "") return fallback;
  if (typeof value !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value))
    return null;
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}
function shift(date, minute, delta) {
  const total = minute + delta,
    days = Math.floor(total / 1440);
  return { date: addDays(date, days), minute: ((total % 1440) + 1440) % 1440 };
}
export function tasks(state, day = today()) {
  if (!validDate(day)) throw new Error("Date de programmation invalide.");
  const result = [],
    until = addDays(day, 90);
  for (const id of PROFILES) {
    const p = state?.profiles?.[id];
    if (!p || p.id !== id) continue;
    for (const task of reminders(p, day)) {
      const rawDate = task.postponedUntil || task.due || day;
      if (!validDate(rawDate) || rawDate > until) continue;
      const date = rawDate < day ? day : rawDate;
      result.push({
        profile: id,
        seed: `${id}|follow|${task.key}|${task.postponedUntil || ""}`,
        date,
        minute: 1080,
        expiryDate: addDays(date, 2),
        expiryMinute: 1439,
      });
    }
    const planned = rows(p.plan?.sessions);
    for (const session of planned) {
      if (
        !session ||
        session.status !== "planned" ||
        typeof session.id !== "string" ||
        !session.id ||
        session.id.length > 250 ||
        planned.filter((s) => s?.id === session.id).length !== 1 ||
        !validDate(session.date) ||
        session.date < day ||
        session.date > until
      )
        continue;
      if (
        rows(p.sessions).some(
          (s) =>
            (s?.planId === session.id || s?.id === session.id) &&
            ["completed", "partial"].includes(s.status),
        ) ||
        p.workout?.planId === session.id
      )
        continue;
      const minute = timeMinute(session.time);
      if (minute === null) continue; // Never silently repair an explicit malformed time.
      const at = shift(session.date, minute, -30);
      result.push({
        profile: id,
        seed: `${id}|session|${session.id}|${session.date}|${minute}`,
        ...at,
        expiryDate: session.date,
        expiryMinute: minute,
      });
    }
  }
  // Earliest deadlines first; deterministic, bounded native payload.
  return result
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        a.minute - b.minute ||
        a.seed.localeCompare(b.seed),
    )
    .slice(0, 128);
}
export async function encode(plan, cryptoApi = globalThis.crypto) {
  if (!cryptoApi?.subtle)
    throw new Error("Service de programmation sécurisé indisponible.");
  return Promise.all(
    plan.map(async ({ seed, ...task }) => ({
      ...task,
      key: Array.from(
        new Uint8Array(
          await cryptoApi.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(seed),
          ),
        ),
        (b) => b.toString(16).padStart(2, "0"),
      ).join(""),
    })),
  );
}
export async function payload(state, day = today(), cryptoApi) {
  return encode(tasks(state, day), cryptoApi);
}
