import { today } from "./utils.js";
/** Immutable historical schedules, without silently evicting older cycles. */
export function archivePlan(p) {
  if (!p.plan) return;
  const old = structuredClone(p.plan);
  old.archivedAt = Date.now();
  old.archivedDate = today();
  old.sessions = old.sessions.map((s) =>
    s.status === "planned" && s.date >= today()
      ? { ...s, status: "superseded" }
      : s,
  );
  p.archivedPlans = [
    ...(p.archivedPlans || []).filter((x) => x.id !== old.id),
    old,
  ];
}
export function plannedSessions(p, { includeSuperseded = false } = {}) {
  const map = new Map();
  for (const plan of [...(p.archivedPlans || []), p.plan].filter(Boolean))
    for (const s of plan.sessions || []) {
      if (!includeSuperseded && s.status === "superseded") continue;
      map.set(s.id, s);
    }
  return [...map.values()].sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      (a.time || "").localeCompare(b.time || ""),
  );
}
export function findPlanned(p, id) {
  return [p.plan, ...(p.archivedPlans || [])]
    .filter(Boolean)
    .flatMap((x) => x.sessions)
    .find((s) => s.id === id);
}
export function completePlanned(p, id, status, date) {
  const s = findPlanned(p, id);
  if (!s) return;
  if (s.date !== date) {
    s.originalDate = s.originalDate || s.date;
    s.date = date;
  }
  s.status = status;
  s.performedDate = date;
}
