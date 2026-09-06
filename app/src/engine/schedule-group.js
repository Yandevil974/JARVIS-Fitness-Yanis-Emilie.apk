import { addDays, dayDiff, today, uid } from "./utils.js";
import { validDate } from "./validation.js";
export function scheduledFamily(plan, id, { includeParents = true } = {}) {
  const items = plan?.sessions || [];
  let root = items.find((s) => s.id === id);
  if (!root) throw new Error("Séance introuvable.");
  const seen = new Set();
  while (includeParents && root.parentId && !seen.has(root.id)) {
    seen.add(root.id);
    const parent = items.find(
      (s) => s.id === root.parentId && s.status === "planned",
    );
    if (!parent) break;
    root = parent;
  }
  const ids = new Set([root.id]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const item of items)
      if (item.parentId && ids.has(item.parentId) && !ids.has(item.id)) {
        ids.add(item.id);
        grew = true;
      }
  }
  return { root, items: items.filter((s) => ids.has(s.id)), ids };
}
function ensureEditable(p, family) {
  if (family.items.some((s) => s.status !== "planned"))
    throw new Error(
      "Un bloc lié possède déjà un résultat ou un statut historique. Il ne sera pas déplacé.",
    );
  if (
    family.ids.has(p.workout?.planId) ||
    family.ids.has(p.timer?.meta?.planId)
  )
    throw new Error(
      "Terminez la séance ou le protocole en cours avant de déplacer son programme.",
    );
}
function minutes(time) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time || ""))
    throw new Error("Horaire invalide.");
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}
export function moveScheduledFamily(p, id, date, { time } = {}) {
  if (!validDate(date) || date < today())
    throw new Error("Choisissez une date valide à partir d’aujourd’hui.");
  const plan = structuredClone(p.plan),
    family = scheduledFamily(plan, id);
  ensureEditable(p, family);
  const sourceDate = family.root.date,
    sourceTime = family.root.time || "18:00",
    shift = time == null ? 0 : minutes(time) - minutes(sourceTime);
  const changes = family.items.map((s) => {
    const offset = dayDiff(s.date, sourceDate),
      clock = minutes(s.time || sourceTime) + shift,
      dayOffset = Math.floor(clock / 1440),
      value = ((clock % 1440) + 1440) % 1440;
    return {
      item: s,
      date: addDays(date, offset + dayOffset),
      time: `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`,
    };
  });
  if (changes.some((c) => c.date < today()))
    throw new Error("Un bloc lié serait déplacé dans le passé.");
  for (const c of changes)
    if (
      plan.sessions.some(
        (s) =>
          !family.ids.has(s.id) && s.status === "planned" && s.date === c.date,
      )
    )
      throw new Error(
        "Un autre entraînement est déjà prévu sur un des jours visés. Choisissez un créneau libre.",
      );
  for (const c of changes) {
    if (c.item.date === c.date && c.item.time === c.time) continue;
    c.item.scheduleHistory = [
      ...(c.item.scheduleHistory || []),
      {
        from: c.item.date,
        to: c.date,
        fromTime: c.item.time || null,
        toTime: c.time,
        at: Date.now(),
      },
    ];
    c.item.originalDate = c.item.originalDate || c.item.date;
    c.item.date = c.date;
    c.item.time = c.time;
    c.item.contentLocked = true;
    c.item.scheduleModified = true;
  }
  plan.sessions.sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      (a.time || "").localeCompare(b.time || ""),
  );
  return plan;
}
export function rescheduleScheduledFamily(p, id) {
  const plan = structuredClone(p.plan),
    family = scheduledFamily(plan, id);
  ensureEditable(p, family);
  if (family.root.date > today())
    throw new Error(
      "Pour une séance future, utilisez le déplacement plutôt que « manquée ».",
    );
  const remap = new Map(family.items.map((s) => [s.id, uid()]));
  const copies = family.items.map((s) => {
    const copy = structuredClone(s);
    s.status = "missed";
    copy.id = remap.get(s.id);
    copy.status = "planned";
    copy.rescheduledFrom = s.id;
    copy.contentLocked = true;
    if (copy.parentId) {
      if (remap.has(copy.parentId)) copy.parentId = remap.get(copy.parentId);
      else {
        copy.detachedFrom = copy.parentId;
        copy.parentId = null;
      }
    }
    return copy;
  });
  plan.sessions.push(...copies);
  const copyIds = new Set(copies.map((s) => s.id));
  let date = addDays(today(), 1);
  for (let n = 0; n < 366; n++, date = addDays(date, 1)) {
    const clash = plan.sessions.some(
      (s) =>
        s.status === "planned" &&
        !copyIds.has(s.id) &&
        (s.focus || []).some((m) => (family.root.focus || []).includes(m)) &&
        Math.abs(dayDiff(s.date, date)) < 2,
    );
    if (clash) continue;
    try {
      return {
        plan: moveScheduledFamily(
          { ...p, plan },
          remap.get(family.root.id),
          date,
        ),
        date,
      };
    } catch (e) {
      if (!/créneau libre/.test(e.message)) throw e;
    }
  }
  throw new Error("Aucun créneau libre pour la séance et ses blocs liés.");
}
export function removeScheduledFamily(p, id) {
  const plan = structuredClone(p.plan),
    family = scheduledFamily(plan, id, { includeParents: false });
  ensureEditable(p, family);
  plan.sessions = plan.sessions.filter((s) => !family.ids.has(s.id));
  return plan;
}
